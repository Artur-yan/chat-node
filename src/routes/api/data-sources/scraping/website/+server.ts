import { CB_TOKEN } from '$env/static/private';

export const POST = async ({ request, locals }) => {
  const {
    bot_id, urls, recursionDepth, maxPagesToScrape, chunkSize,
    chunkOverlap, enableAutoSync
  } = await request.json();


  const options = {
    method: 'POST',
    headers: { authorization: CB_TOKEN, 'Content-Type': 'application/json', 'customer-id': bot_id },
    body: JSON.stringify({
      urls: urls,
      recursionDepth: recursionDepth,
      maxPagesToScrape: maxPagesToScrape,
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
      skipEmbeddingGeneration: false,
      enableAutoSync: enableAutoSync,
      embeddingModel: 'OPENAI_ADA_LARGE_3072'
    })
  };

  await fetch('https://api.carbon.ai/web_scrape', options)
    .then(response => response.json())
    .catch(err => console.error(err));
}