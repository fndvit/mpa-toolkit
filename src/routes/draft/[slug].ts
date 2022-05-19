import type { RequestHandler } from "@sveltejs/kit";
import { getPageComponentProps } from "$lib/helpers/server";

export const get: RequestHandler<{slug: string}> = async ({ params: { slug } }) => {
  return getPageComponentProps(slug, true);
};
