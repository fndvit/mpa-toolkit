import { json } from '@sveltejs/kit';
import getMedata from 'metadata-scraper';
import type { RequestHandler } from './$types';


export const GET: RequestHandler = async ( { request } ) => {

  const urlParams = new URLSearchParams(request?.url.split('?')[1]);
  const metaURL = urlParams.get('url');


  return await getMedata(metaURL).then((res) => {
    return json({
      res
    });
  });
};