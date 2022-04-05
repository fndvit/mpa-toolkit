import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";

export const requestToPrismaParams = async (request: Request) => {
  const formData = await request.formData();
  const isCaseStudy = formData.get('caseStudyFields') == undefined;
  const REQUIRED = isCaseStudy
    ? ['title', 'slug', 'image', 'content', 'caseStudyFields']
    : ['title', 'slug', 'summary', 'authors', 'image', 'content'];

  const missingFields = REQUIRED.filter(key => !formData.has(key));
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(',')}`);
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const image = formData.get("image") as string;
  const contentStr = formData.get("content") as string;
  const content = JSON.parse(contentStr);


  //if (isCaseStudy){
    const summary = '';
    const authors = {};
    const caseStudyFieldsStr = formData.get("caseStudyFields") as string;
    const csf = JSON.parse(caseStudyFieldsStr);
    csf.pageId = 45;

    return {
      title, slug, content, authors, summary,
      img: image,
      caseStudyFields: {
        create: {name: "1", size: "2", governance: "-", yearEstablished: 1, staff: "-", budget: "-", budgetLevel: "-", milestones: "-", coordAltitude: 12, coordLatitude: 12}
      }
    };
  //}

  /*else {
    const summary = formData.get("summary") as string;
    //const authors = formData.get("authors") as string;
    const authors = {};
    const caseStudyFields = undefined;

    return {
      title, slug, summary, content, caseStudyFields, authors,
      img: image,
      //authors: {
        //connect: authors.split(",").map(id => ({
          //id: parseInt(id)
        //}))
      //},
    };
  }*/
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
