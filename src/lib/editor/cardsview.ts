import type { Node } from "prosemirror-model";
import { NodeSelection } from "prosemirror-state";
import type { NodeView, EditorView } from "prosemirror-view";
import type { SvelteComponent } from "svelte";
import { bind } from "svelte/internal";
import Cards from '../components/Cards/Cards.svelte';

export default class CardsView implements NodeView {

  dom: HTMLElement;
  component: SvelteComponent;
  view: EditorView;
  getPos: () => number;
  unbind: () => void;

  constructor(node: Node, view: EditorView, getPos: () => number) {
    this.view = view;
    this.getPos = getPos;;
    this.dom = document.createElement('div');

    this.component = new Cards({
      target: this.dom,
      props: {
        cards: node.attrs.data,
        editable: true
      }
    });

    bind(this.component, 'cards', (cards: Cards['$$prop_def']['cards']) => {
      const transaction = cards.length > 0
        ? view.state.tr.setNodeMarkup(getPos(), null, { data: cards })
        : view.state.tr.delete(getPos(), getPos() + 1);
      view.dispatch(transaction);
    });


    const onClick = () => {
      const tr = view.state.tr.setSelection(
        new NodeSelection(view.state.doc.resolve(getPos()))
      );
      view.dispatch(tr);
    };

    this.dom.addEventListener('click', onClick);
    this.unbind = () => this.dom.removeEventListener('click', onClick);

  }

  ignoreMutation() { return true; }

  stopEvent() {
    return true;
  }

  _setSelected(selected: boolean) {
    this.component.$set({ selected });
  }

  selectNode() {
    this._setSelected(true);
  }

  deselectNode() {
    this._setSelected(false);
  }

  destroy() {
    this.unbind();
    window.setTimeout(() => this.component.$destroy());
    this.dom.remove();
  }
}
