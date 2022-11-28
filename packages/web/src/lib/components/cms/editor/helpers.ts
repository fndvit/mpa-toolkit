import { range } from '@mpa/utils';
import type { MarkType, Node, NodeType, ResolvedPos } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';
import { schema } from '$lib/editor/schema';

export function getPath($resolved: ResolvedPos) {
  return range(0, $resolved.depth + 1).map(i => $resolved.node(i));
}

export function isListNode(node: NodeType) {
  return node === schema.nodes.bullet_list || node === schema.nodes.ordered_list;
}

interface SearchSiblingsOpts {
  parent: Node;
  childIndex: number;
  dir: 'forwards' | 'backwards' | 'both';
  predicate: (node: Node) => boolean;
}

export const searchSiblings = ({ parent, childIndex, dir, predicate }: SearchSiblingsOpts): Node | null => {
  if (dir === 'both') {
    return (
      searchSiblings({ parent, childIndex: childIndex + 1, dir: 'forwards', predicate }) ||
      searchSiblings({ parent, childIndex: childIndex, dir: 'backwards', predicate })
    );
  }
  if (childIndex >= parent.childCount || childIndex < 0) return null; // out of bounds
  const node = parent.child(childIndex);
  if (!node) return null; // reached the end
  const predVal = predicate(node); // check the node
  if (predVal === null) return null; // break clause
  if (predVal) return node; // found it
  const delta = dir === 'forwards' ? 1 : -1;
  return searchSiblings({ parent, childIndex: childIndex + delta, dir, predicate });
};

export function isMarkActive(state: EditorState, type: MarkType) {
  const { from, to, empty } = state.selection;
  if (empty) return !!type.isInSet(state.storedMarks || state.selection.$from.marks());
  else return state.doc.rangeHasMark(from, to, type);
}
