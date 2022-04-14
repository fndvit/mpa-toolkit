import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";

import { richTextKeyMapPlugin } from "./keymap";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { placeholderPlugin } from "./placeholder";

export { dropCursor, gapCursor, richTextKeyMapPlugin };

/**
 * Core plugins which will be passed by default to each editor state instance
 * @type {*[]}
 */

const selectedDecoration = new Plugin({
	props: {
		decorations(state) {
			const selection = state.selection;
			const resolved = state.doc.resolve(selection.from);
			const decoration = Decoration.node(resolved.before(1), resolved.after(1), {class: 'selected'});
			return DecorationSet.create(state.doc, [decoration]);
		}
	}
});

export const corePlugins = [
  history(),
  keymap({"Mod-z": undo, "Mod-y": redo, "Mod-Shift-z": redo}),
  keymap(baseKeymap),
];

export const richTextPlugins = [
  dropCursor(),
  gapCursor(),
  richTextKeyMapPlugin,
  selectedDecoration,
  placeholderPlugin
];
