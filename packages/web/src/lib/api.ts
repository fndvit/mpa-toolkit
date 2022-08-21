import type { APIRequests as API, Author, Page, Tag, User } from '@mpa/db';
import { default as _ky } from 'ky';
import type { GoogleAuthReturnData } from '../routes/api/auth/google/+server';

const ky = _ky.create({ prefixUrl: '/api', headers: { Accept: 'application/json' } });

export const image = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await ky.put('image/upload', {
      body: formData
    });
    const body = (await response.json()) as { path: string };
    return body.path;
  }
};

export const user = {
  update: async (id: number, json: API.User) => _createUpdate('user', json, id),
  delete: async (id: number) => (await ky.delete(`users/${id}`)).ok
};

export const author = {
  update: async (id: number, json: API.Author) => _createUpdate('author', json, id),
  create: async (json: API.Author) => _createUpdate('author', json),
  delete: async (id: number) => (await ky.delete(`authors/${id}`)).ok
};

export const page = {
  create: async (data: API.Page) => _createUpdate('page', data),
  update: async (id: number, data: API.Page) => _createUpdate('page', data, id),
  delete: async (id: number) => (await ky.delete(`pages/${id}`)).ok
};

export const tag = {
  create: async (data: API.Tag) => _createUpdate('tag', data),
  update: async (id: number, data: API.Tag) => _createUpdate('tag', data, id),
  delete: async (id: number) => (await ky.delete(`tags/${id}`)).ok
};

export const auth = {
  logout: async () => (await ky.post('auth/logout')).ok,
  google: async (token: string) => {
    const res = await ky.post('auth/google', { json: { token } });
    return res.ok ? res.json<GoogleAuthReturnData>() : null;
  }
};

function _createUpdate(model: 'page', json: API.Page, id?: number): Promise<Page.DB>;
function _createUpdate(model: 'tag', json: API.Tag, id?: number): Promise<Tag.DB>;
function _createUpdate(model: 'user', json: API.User, id?: number): Promise<User.DB>;
function _createUpdate(model: 'author', json: API.Author, id?: number): Promise<Author.DB>;
async function _createUpdate(model: string, json: unknown, id?: number) {
  const create = id === undefined;
  const method = create ? 'PUT' : 'PATCH';
  const url = `${model}s/${create ? 'create' : id}`;
  const response = await ky(url, { method, json });
  return response.json();
}
