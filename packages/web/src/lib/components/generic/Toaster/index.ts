import { writable } from 'svelte/store';

interface Options {
  durationMs: number;
  type: 'info' | 'error' | 'done';
}

export type Toast = {
  id: number;
  text: string;
  type: Options['type'];
};

const DEFAULT_OPTIONS: Options = {
  durationMs: 5000,
  type: 'info'
};

function createToastStore() {
  let id = 0;
  const { subscribe, set } = writable<Toast[]>([]);

  let toasts: Toast[];
  subscribe(v => (toasts = v));

  const _removeToast = (toast: Toast) => {
    set(toasts.filter(m => m !== toast));
  };

  const _addToast = (text: string, opts: Partial<Options> = {}) => {
    const { type, durationMs } = { ...DEFAULT_OPTIONS, ...opts };
    const toast = { id: id++, text, type };
    set([toast, ...toasts]);
    window.setTimeout(() => _removeToast(toast), durationMs);
  };

  const info = (msg: string) => _addToast(msg, { type: 'info' });
  const error = (msg: string) => _addToast(msg, { type: 'error' });
  const done = (msg: string) => _addToast(msg, { type: 'done' });
  const report = async (fn: () => unknown, doneMsg: string, errorMsg: string) => {
    try {
      await fn();
      done(doneMsg);
    } catch (err) {
      console.error(err);
      error(errorMsg);
    }
  };

  return { subscribe, info, error, done, report };
}

export const toaster = createToastStore();
