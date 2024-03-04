import { CB_TOKEN } from '$env/static/private';
import { json } from "@sveltejs/kit";


interface ScrapeConfig {
  urls: string[];
}

interface ScrapeConfigSingleUrl extends Omit<ScrapeConfig, 'urls'> {
  url: string;
}

function transformConfigToSingleUrlList(config: ScrapeConfig): ScrapeConfigSingleUrl[] {
  return config.urls.map(url => ({
    url
  }));
}


export const POST = async ({ request, locals }) => {
  const {
    bot_id, sitemapUrl
  } = await request.json();

  const session = await locals.auth.validate();

	if (session) {

  const options = {
    method: 'GET',
    headers: { authorization: `Bearer ${CB_TOKEN}`, 'Content-Type': 'application/json', 'customer-id': bot_id }
  };

  const response = await fetch(`https://api.carbon.ai/process_sitemap?url=${sitemapUrl}`, options)
    .then(response => response.json())
    .catch(err => console.error(err));

  return json(response)
}
  else
  {
  return new Response(JSON.stringify({ status: 401 }));
  }
}