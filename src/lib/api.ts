import type { User } from "$lib/types";
import type { UserRequest } from "./types";

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

export async function updateUser(id: number, data: UserRequest) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
  const { user } = await response.json() as {user: User};
  return user;
}
