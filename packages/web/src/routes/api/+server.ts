import { apiEndpoint } from '$lib/helpers/endpoints';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = apiEndpoint<RequestHandler>(async () => {
  return json({ status: 'ok' });
});
