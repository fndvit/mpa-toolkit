import { goto } from '$app/navigation';
import { session } from '$app/stores';
import type { UserRequest, PageRequest, TagRequest, AuthorRequest, User, Page, Tag, Author } from '$lib/types';
import ky from 'ky';

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await ky.put('/api/image/upload', {
    body: formData
  });
  const body = (await response.json()) as { path: string };
  return body.path;
}

export async function updateUser(id: number, data: UserRequest) {
  const response = await ky.patch(`/api/users/${id}`, {
    body: JSON.stringify(data)
  });
  const { user } = (await response.json()) as { user: User };
  return user;
}

export async function deleteUser(id: number) {
  const response = await ky.delete(`/api/users/${id}`);
  return response.ok;
}

export async function updateAuthor(id: number, data: AuthorRequest) {
  const response = await ky.patch(`/api/authors/${id}`, {
    body: JSON.stringify(data)
  });
  const author = (await response.json()) as Author;
  return author;
}

export async function deleteAuthor(id: number) {
  const response = await ky.delete(`/api/authors/${id}`);
  return response.ok;
}

export async function createAuthor(data: AuthorRequest) {
  const response = await ky.put('/api/authors/create', {
    body: JSON.stringify(data)
  });

  const author = (await response.json()) as Author;
  return author;
}

async function _page(data: PageRequest, id?: number) {
  const newPage = id === undefined;
  const response = await ky(newPage ? '/api/pages/create' : `/api/pages/${id}`, {
    method: newPage ? 'PUT' : 'PATCH',
    body: JSON.stringify(data)
  });

  const page = (await response.json()) as Page;
  return page;
}

async function _tag(data: TagRequest, id?: number) {
  const newTag = id === undefined;
  const response = await ky(newTag ? '/api/tags/create' : `/api/tags/${id}`, {
    method: newTag ? 'PUT' : 'PATCH',
    body: JSON.stringify(data)
  });

  const page = (await response.json()) as Tag;
  return page;
}

export async function createPage(data: PageRequest) {
  return _page(data);
}

export async function updatePage(id: number, data: PageRequest) {
  return _page(data, id);
}

export async function deletePage(id: number) {
  const response = await ky.delete(`/api/pages/${id}`);
  return response.ok;
}

export async function createTag(data: TagRequest) {
  return _tag(data);
}

export async function updateTag(id: number, data: TagRequest) {
  return _tag(data, id);
}

export async function deleteTag(id: number) {
  const response = await ky.delete(`/api/tags/${id}`);
  return response.ok;
}

export async function logout() {
  const res = await ky.post('/api/auth/logout');
  if (res.ok) {
    session.set({});
    goto('/cms/login');
  } else console.error(`Logout not successful: ${res.statusText} (${res.status})`);
}
