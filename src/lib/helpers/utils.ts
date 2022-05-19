export function groupBy<T, K extends string, U = null>
(arr: T[], keyFn: (i: T) => K, mapFn?: (i: T) => U) {

return arr.reduce<{[KV in K]?: (U extends null ? T : U)[] }>((acc, item) => {
  const key = keyFn(item);
  acc[key] = acc[key] || [];
  acc[key].push(!mapFn ? item as any: mapFn(item));
  return acc;
}, {});
}

export type Unpacked<T> = T extends (infer U)[] ? U : T;

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