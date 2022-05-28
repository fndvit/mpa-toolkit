import type { NodeSpec } from "prosemirror-model";
import { Plugin as ProsePlugin, PluginKey } from "prosemirror-state";
import { createSvelteNodeView, SvelteComponentConstructor } from "./svelte-nodeview";

export interface PluginOptions {
  nodes: {
    [key: string]: SvelteComponentConstructor
  }
}

export function mapValues<T, U, K extends string>
  (obj: Record<K, T>, mapFn: (val: T, key: K) => U)
  : Record<K, U>
{
  const entries = Object.entries(obj) as [K, T][];
  const mappedEntries = entries.map<[K, U]>(([key, val]) => [key, mapFn(val, key)]);
  return Object.fromEntries(mappedEntries);
}

export const sveltePlugin = (options: PluginOptions) => {
  const nodeViews = mapValues(
    options.nodes,
    (ctor, name) => createSvelteNodeView(ctor, {name})
  );
  return new ProsePlugin({
    key: new PluginKey("prosemirror-svelte"),
    props: { nodeViews },
  });
};

export function svelteSchemaNode(tag: string, defaultData: Record<string, unknown>): NodeSpec {
  return {
    defining: true,
    draggable: true,
    attrs: mapValues(defaultData, v => ({ default:  v })),

    parseDOM: [{
      tag,
      getAttrs(dom: Element) {
        return mapValues(
          defaultData,
          (_, attr) => JSON.parse(dom.getAttribute(`data-${attr}`))
        );
      }
    }],

    toDOM(node) {
      const mappedEntries = Object.entries(node.attrs)
        .map(([key, val]) => [`data-${key}`, JSON.stringify(val)]);
      return [ tag, Object.fromEntries(mappedEntries) ];
    },
  };
}
