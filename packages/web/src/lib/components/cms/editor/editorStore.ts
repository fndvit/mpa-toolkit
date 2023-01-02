import type { APIRequests } from '@mpa/db';
import { writable } from 'svelte/store';

export const editorStore = writable({
  dirty: false,
  saveable: false,
  saving: false,
  page: null as APIRequests.Page,
  savedPage: null as APIRequests.Page,
  isNewPage: false,
  preview: false
});
