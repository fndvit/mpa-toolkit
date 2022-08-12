import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { richTextKeyMapPlugin } from './keymap';
import { Plugin } from 'prosemirror-state';
import { placeholderPlugin } from './placeholder';
import type { Schema } from 'prosemirror-model';
import type { DecorationSet } from 'prosemirror-view';
import { buildInputRules } from './inputRules';

export { dropCursor, gapCursor };

export const emptyPlugin = new Plugin<DecorationSet>({
  view: _view => {
    const update = view => {
      const isEmpty =
        view.state.doc.content.size === 0 || (view.state.doc.textContent === '' && view.state.doc.content.size < 3);

      view.dom.classList[isEmpty ? 'add' : 'remove']('ProseMirror-empty');
    };

    update(_view);
    return { update };
  }
});

export const plugins = (schema: Schema): Plugin[] => {
  return [
    history(),
    keymap(baseKeymap),
    buildInputRules(schema),
    dropCursor(),
    gapCursor(),
    richTextKeyMapPlugin(schema),
    emptyPlugin,
    placeholderPlugin
  ];
};
