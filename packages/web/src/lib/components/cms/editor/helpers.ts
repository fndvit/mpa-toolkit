import { range } from '@mpa/utils';
import type { NodeType, ResolvedPos } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';
import { schema } from '$lib/editor/schema';

export function getListMetadata(state: EditorState) {
  const { $from } = state.selection;
  const nodes = Array($from.depth)
    .fill(0)
    .map((_, i) => $from.node(i));

  const depthOfContainingList = Array($from.depth)
    .fill(0)
    .map((_, i) => i)
    .reverse()
    .find(i => $from.node(i).type.name === 'bullet_list');

  const hasPrevSibling = $from.index(depthOfContainingList) > 0;

  const depth = nodes.filter(({ type }) => type.name === 'list_item').length;

  return {
    depth,
    hasPrevSibling
  };
}

export function getPath($resolved: ResolvedPos) {
  return range(0, $resolved.depth).map(i => $resolved.node(i));
}

export function isListNode(node: NodeType) {
  return node === schema.nodes.bullet_list || node === schema.nodes.ordered_list;
}
