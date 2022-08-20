
export function createLookup<T, U extends string, Y = never>(arr: T[], keyFn: (d: T) => U | U[], valFn?: (d: T) => Y) {
  type R = [Y] extends [never] ? T : Y;
  const lookup: { [key in U]?: R } = {};
  const _valFn = (valFn ?? (d => d)) as (d: T) => R;

  arr.forEach(d => {
    const key = keyFn(d);
    if (typeof key === 'string') {
      lookup[key] = _valFn(d);
    } else {
      key.forEach(k => (lookup[k] = _valFn(d)));
    }
  });

  return lookup;
}

// ************************
//     TypeScript util
// ************************

export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;
export type Unpacked<T> = T extends (infer U)[] ? U : T;
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
export type Modify<T, R> = Expand<Omit<T, keyof R> & R>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

type Cast<A, B> = A extends B ? A : B;

type Narrowable = string | number | boolean | bigint;

export type Exact<A, W = unknown> = W extends unknown
  ? A extends Narrowable
    ? Cast<A, W>
    : Cast<
        { [K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never },
        { [K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K] }
      >
  : never;
