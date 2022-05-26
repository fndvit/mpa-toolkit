import type { Node } from "prosemirror-model";
import type { NodeView, EditorView } from "prosemirror-view";
import type { SvelteComponent } from "svelte";
import { bind } from "svelte/internal";
import Cards from '../components/Cards/Cards.svelte';

export default class CardsView implements NodeView {

  dom: HTMLElement;
  component: SvelteComponent;

  constructor(node: Node, view: EditorView, getPos: () => number) {
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
  }

  ignoreMutation() { return true; }

  stopEvent() {
    return true;
  }

  selectNode() {
    return false;
  }

  deselectNode() {
    return false;
  }

  destroy() {
    window.setTimeout(() => this.component.$destroy());
    this.dom.remove();
  }
}
