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

  let apiUrl;
  if (endpoint === 'page') {
    apiUrl = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,fan_count,followers_count&access_token=${TOKEN}`;
  } else {
    const fields = 'impressions,reach,clicks,unique_clicks,ctr,cpc,cpm,spend,actions';
    const timeRange = encodeURIComponent(JSON.stringify({ since, until }));
    apiUrl = `https://graph.facebook.com/v21.0/${ACCOUNT_ID}/insights?fields=${fields}&time_range=${timeRange}&time_increment=1&access_token=${TOKEN}`;
  }

  try {
    const resp = await fetch(apiUrl);
    const data = await resp.json();
    return new Response(JSON.stringify(data), {
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
