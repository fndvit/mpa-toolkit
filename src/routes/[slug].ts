import type { RequestHandler } from "@sveltejs/kit";
import { getPageComponentProps } from "$lib/prisma/wrappers";

export const get: RequestHandler<{slug: string}> = async ({ params: { slug } }) => {
  return getPageComponentProps(slug, false);
};
