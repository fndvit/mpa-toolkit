export function groupBy<T, K extends string, U = null>
(arr: T[], keyFn: (i: T) => K, mapFn?: (i: T) => U) {

return arr.reduce<{[KV in K]?: (U extends null ? T : U)[] }>((acc, item) => {
  const key = keyFn(item);
  acc[key] = acc[key] || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  acc[key].push(!mapFn ? item as any: mapFn(item));
  return acc;
}, {});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compareDeep(a: any, b: any) {
  if (a === b) return true;
  if (!(a && typeof a == "object") ||
      !(b && typeof b == "object")) return false;
  const array = Array.isArray(a);
  if (Array.isArray(b) != array) return false;
  if (array) {
    if (a.length != b.length) return false;
    for (let i = 0; i < a.length; i++) if (!compareDeep(a[i], b[i])) return false;
  } else {
    for (const p in a) if (!(p in b) || !compareDeep(a[p], b[p])) return false;
    for (const p in b) if (!(p in a)) return false;
  }
  return true;
}

export function slugify(text: string, maxLen = 40) {
  return (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, maxLen);
}

export function createLookup<T, Y>
(
  arr: T[],
  keyFn: (d: T) => string,
  valFn: (d: T) => Y
): {[key: string]: Y} {

  const lookup: {[key: string]: Y} = {};

  arr.forEach(d => {
    const key = keyFn(d);
    lookup[key] = valFn(d);
  });

  return lookup;
}

export const textOnlyPaste = (el: HTMLElement) => {
  el.addEventListener('paste', e => {
    const { clipboardData } = e;
    const paste = clipboardData.getData('text').replace(/\n/g, ' ');
    document.execCommand("insertText", false, paste);
    e.preventDefault();
  });
};

export const addFocusClass = (node: HTMLElement, cb: (focused: boolean) => void = () => null) => {
  node.addEventListener('focus', () => {
    node.classList.add('focused');
    cb(true);
  });
  node.addEventListener('blur', () => {
    node.classList.remove('focused');
    cb(false);
  });
};

// ************************
//     TypeScript util
// ************************

export type ExpandRecursively<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;
export type Unpacked<T> = T extends (infer U)[] ? U : T;
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
export type Modify<T, R> = Expand<Omit<T, keyof R> & R>;

type Cast<A, B> = A extends B ? A : B;

type Narrowable = string | number | boolean | bigint;

export type Exact<A, W = unknown> =
W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
{[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
{[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
: never;
