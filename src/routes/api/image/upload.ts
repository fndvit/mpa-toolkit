import { authMiddleware } from '$lib/auth';
import { uploadImage } from '$lib/s3';

export const PUT = authMiddleware({ role: 'CONTENT_MANAGER' }, async ({ request }) => {
  const formData = await request.formData();
  const image = formData.get('image') as File;
  const imgPath = await uploadImage(image);
  return {
    status: 200,
    body: {
      path: imgPath
    }
  };
});
