
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch('/api/image/upload', {
    method: 'PUT',
    body: formData,
  });
  const body = await response.json() as {path: string};
  return body.path;
}
