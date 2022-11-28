import { schema } from '$lib/editor/schema';
import Emittery from 'emittery';
import type { Node, Mark } from 'prosemirror-model';
import type { Transaction } from 'prosemirror-state';
import { Plugin, PluginKey } from 'prosemirror-state';
import { AddMarkStep } from 'prosemirror-transform';
import { Decoration, DecorationSet, type EditorView } from 'prosemirror-view';

export type SelectedLink = { from: number; to: number; node?: Node; mark?: Mark };

export const linkPluginKey = new PluginKey('LinkTooltip');

export class LinkPlugin extends Plugin<{ decorations: DecorationSet }> {
  last?: SelectedLink;
  ee = new Emittery<{ click: SelectedLink }>();

  constructor() {
    super({
      key: linkPluginKey,
      state: {
        init: () => ({ decorations: DecorationSet.empty }),
        apply: (tr, old) => {
          if (tr.steps.length === 1 && tr.steps[0] instanceof AddMarkStep) {
            const { mark, from, to } = tr.steps[0];
            if (mark.type === schema.marks.link) {
              const link = { from, to, mark: mark, node: tr.doc.nodeAt(from) };
              this.ee.emit('click', link);
            }
          }
          return tr.getMeta(this) !== undefined ? this.update(tr) : old;
        }
      },
      props: {
        decorations: state => this.getState(state).decorations,
        handleClick: (view, pos) => {
          const textNode = view.state.doc.nodeAt(pos);
          if (textNode.type === schema.nodes.text) {
            const linkMark = textNode.marks.find(m => m.type === schema.marks.link);
            if (linkMark) {
              const resolved = view.state.doc.resolve(pos);
              const from = pos - resolved.textOffset;
              const to = from + textNode.nodeSize;
              this.ee.emit('click', { node: textNode, mark: linkMark, from, to });
              return true;
            }
          }
          this.ee.emit('click', { from: pos, to: pos });
        }
      }
    });
  }

  update(tr: Transaction) {
    const link = tr.getMeta(this) as { from: number; to: number };
    if (!link) return { decorations: DecorationSet.create(tr.doc, []) };
    const deco = Decoration.inline(link.from, link.to, { class: 'link-decoration' });
    return {
      decorations: DecorationSet.create(tr.doc, [deco])
    };
  }

  setDecoration(view: EditorView, link: SelectedLink) {
    if (!this.last && !link) return;
    this.last = link;
    const tr = view.state.tr.setMeta(this, link);
    view.dispatch(tr);
  }

  on: typeof this.ee.on = this.ee.on.bind(this.ee);
}
