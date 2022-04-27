import type { EditorState, Transaction } from "prosemirror-state";
import { schema } from "./schema";

export function addCard(state: EditorState, dispatch: (tr: Transaction) => void) {
  const resolved = state.doc.resolve(state.selection.from);
  const parent = resolved.node(1);
  if (parent.type === schema.nodes.cards) {
    const tr = state.tr.insert(resolved.end(1), schema.nodes.card.createAndFill());
    dispatch(tr);
  }
}
