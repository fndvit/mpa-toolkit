import { generateGlobeSvg } from "$lib/globe/globe";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async evt => {

  const lat = parseFloat(evt.url.searchParams.get('lat'));
  const long = parseFloat(evt.url.searchParams.get('long'));

  if (isNaN(lat) || isNaN(long)) {
    return { status: 400, body: { error: 'Bad request' } };
  }

  return {
    body: generateGlobeSvg(lat, long),
    headers: {
      'Content-Type': 'image/svg+xml'
    }
  };
};
