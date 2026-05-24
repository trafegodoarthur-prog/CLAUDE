// Cloudflare Pages Function: /functions/insights.js
// Endpoint que calcula insights derivados da Meta Ads API
// (creative fatigue, wasted spend, top audiences, anomalies semana a semana)
//
// Deploy: copiar para /functions/insights.js do projeto Cloudflare Pages de cada autora.
// Requer mesmas env vars: META_TOKEN, ACCOUNT_ID

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET' }
    });
  }

  const TOKEN = env.META_TOKEN;
  const ACCOUNT_ID = env.ACCOUNT_ID;

  const yyyy = (d) => d.toISOString().split('T')[0];
  const minus = (d, n) => { const x = new Date(d); x.setDate(x.getDate() - n); return x; };

  const today = new Date();
  const period_end   = yyyy(today);
  const period_start = yyyy(minus(today, 7));
  const prev_end     = yyyy(minus(today, 7));
  const prev_start   = yyyy(minus(today, 14));

  const F_AD      = 'ad_id,ad_name,impressions,frequency,ctr,spend,actions';
  const F_ADSET   = 'adset_id,adset_name,impressions,spend,clicks,actions';
  const F_ACCOUNT = 'impressions,clicks,ctr,spend,actions';

  const base = `https://graph.facebook.com/v21.0/${ACCOUNT_ID}/insights`;
  const tr      = encodeURIComponent(JSON.stringify({ since: period_start, until: period_end }));
  const trPrev  = encodeURIComponent(JSON.stringify({ since: prev_start,   until: prev_end }));
  const urls = {
    ads:       `${base}?level=ad&fields=${F_AD}&time_range=${tr}&access_token=${TOKEN}`,
    adsets:    `${base}?level=adset&fields=${F_ADSET}&time_range=${tr}&access_token=${TOKEN}`,
    breakdown: `${base}?fields=${F_ACCOUNT}&breakdowns=age,gender&time_range=${tr}&access_token=${TOKEN}`,
    thisWeek:  `${base}?fields=${F_ACCOUNT}&time_range=${tr}&access_token=${TOKEN}`,
    prevWeek:  `${base}?fields=${F_ACCOUNT}&time_range=${trPrev}&access_token=${TOKEN}`,
  };

  try {
    const [ads, adsets, breakdown, thisWeek, prevWeek] = await Promise.all(
      Object.values(urls).map(u => fetch(u).then(r => r.json()))
    );

    const getAction = (acts, type) => {
      if (!acts) return 0;
      const a = acts.find(x => x.action_type === type);
      return a ? parseInt(a.value) : 0;
    };

    const fatigued = (ads.data || [])
      .map(ad => ({
        name: ad.ad_name,
        frequency: parseFloat(ad.frequency || 0),
        ctr: parseFloat(ad.ctr || 0),
        spend: parseFloat(ad.spend || 0),
        impressions: parseInt(ad.impressions || 0),
      }))
      .filter(ad => ad.frequency > 2.5 && ad.ctr < 1 && ad.impressions > 500)
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 5);

    const wasted = (adsets.data || [])
      .map(s => {
        const link_clicks = getAction(s.actions || [], 'link_click');
        const spend = parseFloat(s.spend || 0);
        const cpc_link = link_clicks > 0 ? spend / link_clicks : null;
        return { name: s.adset_name, spend, link_clicks, cpc_link };
      })
      .filter(s => s.spend > 5 && (s.link_clicks === 0 || (s.cpc_link !== null && s.cpc_link > 5)))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 5);

    const audience = (breakdown.data || [])
      .map(r => ({
        age: r.age,
        gender: r.gender === 'female' ? 'F' : r.gender === 'male' ? 'M' : 'U',
        impressions: parseInt(r.impressions || 0),
        ctr: parseFloat(r.ctr || 0),
        link_clicks: getAction(r.actions || [], 'link_click'),
        spend: parseFloat(r.spend || 0),
      }))
      .filter(r => r.impressions > 100)
      .sort((a, b) => b.ctr - a.ctr)
      .slice(0, 5);

    const sumWeek = (rows) => {
      const t = { impressions: 0, clicks: 0, spend: 0, link_clicks: 0 };
      (rows || []).forEach(r => {
        t.impressions += parseInt(r.impressions || 0);
        t.clicks      += parseInt(r.clicks || 0);
        t.spend       += parseFloat(r.spend || 0);
        t.link_clicks += getAction(r.actions || [], 'link_click');
      });
      t.ctr      = t.impressions ? (t.clicks / t.impressions * 100) : 0;
      t.cpc_link = t.link_clicks ? (t.spend / t.link_clicks) : 0;
      return t;
    };

    const tw = sumWeek(thisWeek.data || []);
    const pw = sumWeek(prevWeek.data || []);
    const pctDelta = (now, prev) => prev > 0 ? ((now - prev) / prev * 100) : 0;

    const anomalies = [];
    if (pw.impressions > 0) {
      const ctrDelta = pctDelta(tw.ctr, pw.ctr);
      const cpcDelta = pctDelta(tw.cpc_link, pw.cpc_link);
      if (ctrDelta < -25) anomalies.push({ kind: 'ctr_drop', positive: false, msg: `CTR caiu ${Math.abs(ctrDelta).toFixed(0)}% vs semana anterior` });
      if (cpcDelta > 50)  anomalies.push({ kind: 'cpc_rise', positive: false, msg: `CPC de link subiu ${cpcDelta.toFixed(0)}% vs semana anterior` });
      if (ctrDelta > 25)  anomalies.push({ kind: 'ctr_rise', positive: true,  msg: `CTR subiu ${ctrDelta.toFixed(0)}% vs semana anterior` });
      if (cpcDelta < -25) anomalies.push({ kind: 'cpc_drop', positive: true,  msg: `CPC de link caiu ${Math.abs(cpcDelta).toFixed(0)}% vs semana anterior` });
    }

    return new Response(JSON.stringify({
      period: { since: period_start, until: period_end },
      fatigued, wasted, audience, anomalies,
      comparison: { thisWeek: tw, previousWeek: pw },
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
