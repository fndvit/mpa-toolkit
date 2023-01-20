import type { APIRequests } from '@mpa/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { apiEndpoint } from '$lib/helpers/endpoints';

export const PATCH = apiEndpoint<RequestHandler>(async ({ request }) => {
  const body = (await request.json()) as APIRequests.HomepageComponents;

  const components = await db.homepage.updateComponents(body);

  return json(components);
});
