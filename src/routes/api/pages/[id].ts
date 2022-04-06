import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";

export const requestToPrismaParams = async (request: Request) => {
  const formData = await request.formData();

  const REQUIRED = ['title', 'slug', 'summary', 'authors', 'image', 'content', 'tags'];
  const missingFields = REQUIRED.filter(key => !formData.has(key));
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(',')}`);
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const summary = formData.get("summary") as string;
  const authors = formData.get("authors") as string;
  const tags = formData.get("tags") as string;
  const image = formData.get("image") as string;
  const contentStr = formData.get("content") as string;
  const content = JSON.parse(contentStr);

  return {
    title, slug, summary, content,
    img: image,
    authors: {
      connect: authors.split(",").map(id => ({
        id: parseInt(id)
      }))
    },
    tags:{
      create: [
        {
          category: {
            connect: {
              id: 1,
            }
          },
          tag: {
            connect: {
              id: 2,
            },
          },
        },
      ]
    }
  };
};

export const patch = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ request, params }) => {

    const prismaParams = await requestToPrismaParams(request);

    const page = await prisma.page.update({
      where: { id: parseInt(params.id) },
      data: {
        ... prismaParams,
        editedAt: new Date()
      }
    });

    return {
      status: 200,
      body: page
    };

  }
);

export const del = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ params }) => {
    const page = await prisma.page.delete({
      where: { id: parseInt(params.id) }
    });

    return {
      status: 200,
      body: page
    };
  }
);
