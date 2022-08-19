import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { generateGlobeSvg } from '$lib/globe/globe';

export const GET: RequestHandler = async ({ url }) => {
  const _lat = url.searchParams.get('lat');
  const _long = url.searchParams.get('long');
  if (_lat == null || _long == null) throw error(400, 'Missing lat or long');
  const lat = parseFloat(_lat);
  const long = parseFloat(_long);

  if (isNaN(lat) || isNaN(long)) {
    return json(
      { error: 'Bad request' },
      {
        status: 400
      }
    );
  }

  return new Response(generateGlobeSvg(lat, long), {
    headers: {
      'Content-Type': 'image/svg+xml'
    }
  });
};
