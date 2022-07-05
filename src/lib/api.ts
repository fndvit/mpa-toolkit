import type { UserRequest, PageRequest, User, Page } from "$lib/types";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch('/api/image/upload', {
    method: 'PUT',
    body: formData,
  });
  const body = await response.json() as { path: string };
  return body.path;
}

export async function updateUser(id: number, data: UserRequest) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
  const { user } = await response.json() as { user: User };
  return user;
}

export async function deleteUser(id: number) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
}

export async function createUser(data: UserRequest) {
  const response = await fetch('/api/users/create', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return response.ok;
}


async function _page(data: PageRequest, id?: number) {
  const newPage = id === undefined;
  const response = await fetch(
    newPage ? '/api/pages/create' : `/api/pages/${id}`,
    {
      method: newPage ? 'PUT' : 'PATCH',
      body: JSON.stringify(data)
    }
  );

  const page = await response.json() as Page;
  return page;
}

export async function createPage(data: PageRequest) {
  return _page(data);
}

export async function updatePage(id: number, data: PageRequest) {
  return _page(data, id);
}

export async function deletePage(id: number) {
  const response = await fetch(`/api/pages/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
}
