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
    method: 'POST',
    headers: { authorization: `Bearer ${CB_TOKEN}`, 'Content-Type': 'application/json', 'customer-id': bot_id },
    body: JSON.stringify(
      {
        url: sitemapUrl

      }
    )
  };

  const response = await fetch('https://api.carbon.ai/scrape_sitemap', options)
    .then(response => response.json())
    .catch(err => console.error(err));

  console.log(response)
  return json(response)
}
  else
  {
  return new Response(JSON.stringify({ status: 401 }));
  }
}