export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET' }
    });
  }

  const url = new URL(request.url);
  const since    = url.searchParams.get('since') || '2026-05-01';
  const until    = url.searchParams.get('until') || new Date().toISOString().split('T')[0];
  const endpoint = url.searchParams.get('endpoint') || 'insights';

  const TOKEN      = env.META_TOKEN;
  const ACCOUNT_ID = env.ACCOUNT_ID;

  const jsonResp = (obj, status = 200) => new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    }
  });

  try {
    if (endpoint === 'page') {
      const resp = await fetch(`https://graph.facebook.com/v21.0/me/accounts?fields=id,name,fan_count,followers_count&access_token=${TOKEN}`);
      return jsonResp(await resp.json());
    }

    if (endpoint === 'page_fan_adds') {
      const pageId = url.searchParams.get('page_id');
      if (!pageId) return jsonResp({ error: 'page_id required' }, 400);

      const pagesResp = await fetch(`https://graph.facebook.com/v21.0/me/accounts?fields=id,access_token&access_token=${TOKEN}`);
      const pagesData = await pagesResp.json();
      const pageInfo = (pagesData.data || []).find(p => p.id === pageId);
      if (!pageInfo) return jsonResp({ error: 'page not found or no access' }, 404);
      const pageToken = pageInfo.access_token || TOKEN;

      const tr = encodeURIComponent(JSON.stringify({ since, until }));
      const metrics = ['page_daily_follows_unique', 'page_daily_follows', 'page_fan_adds_unique', 'page_fan_adds', 'page_follows'];
      let lastErr = null;
      const attempts = [];
      for (const metric of metrics) {
        const insUrl = `https://graph.facebook.com/v21.0/${pageId}/insights/${metric}?time_range=${tr}&period=day&access_token=${pageToken}`;
        const insResp = await fetch(insUrl);
        const insData = await insResp.json();
        if (insData.error) {
          lastErr = insData.error;
          attempts.push({ metric, error: insData.error.message });
          continue;
        }
        const values = (((insData.data || [])[0] || {}).values) || [];
        attempts.push({ metric, days: values.length });
        if (values.length === 0) continue;
        const total = values.reduce((a, v) => a + parseInt(v.value || 0), 0);
        return jsonResp({ total, daily: values, since, until, page_id: pageId, metric, attempts });
      }
      return jsonResp({ error: lastErr ? lastErr.message : 'all metrics returned empty', tried: metrics, attempts }, 502);
    }

    const fields = 'impressions,reach,clicks,unique_clicks,ctr,cpc,cpm,spend,actions';
    const timeRange = encodeURIComponent(JSON.stringify({ since, until }));
    const apiUrl = `https://graph.facebook.com/v21.0/${ACCOUNT_ID}/insights?fields=${fields}&time_range=${timeRange}&time_increment=1&access_token=${TOKEN}`;
    const resp = await fetch(apiUrl);
    return jsonResp(await resp.json());
  } catch (e) {
    return jsonResp({ error: e.message }, 500);
  }
}
