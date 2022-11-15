import { json } from '@sveltejs/kit';
import getMedata from 'metadata-scraper';
import type { RequestHandler } from './$types';


export const GET: RequestHandler = async ( { request } ) => {
  const urlParams = new URLSearchParams(request?.url?.split('?').slice(1).join('?'));
  const metaURL = urlParams.get('url');
  console.log('URL', (metaURL));

  return await getMedata(metaURL).then((res) => {
    return json({
      res
    });
  });
};