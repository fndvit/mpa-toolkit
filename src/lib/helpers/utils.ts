
export const parseTextToID = (text: string) => text.replace(/\s|\./g, '');

export function groupBy<T, K extends string, U = null>
(arr: T[], keyFn: (i: T) => K, mapFn?: (i: T) => U) {

return arr.reduce<{[KV in K]?: (U extends null ? T : U)[] }>((acc, item) => {
  const key = keyFn(item);
  acc[key] = acc[key] || [];
  acc[key].push(!mapFn ? item as any: mapFn(item));
  return acc;
}, {});
}
