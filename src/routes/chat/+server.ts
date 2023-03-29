import { json } from '@sveltejs/kit';
 
export const POST = async ({ request }) => {
  const { a, b } = await request.json();
  return json(a + b);
};