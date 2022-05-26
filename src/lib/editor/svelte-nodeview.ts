import type { Node } from "prosemirror-model";
import type { NodeView, EditorView } from "prosemirror-view";
import type { SvelteComponent } from "svelte";
import { NodeSelection } from "prosemirror-state";
import './svelte-nodeview.css';

interface IComponentOptions<Props extends Record<string, any> = Record<string, any>> {
  target: Element | ShadowRoot;
  anchor?: Element;
  props?: Props;
  context?: Map<any, any>;
  hydrate?: boolean;
  intro?: boolean;
  $$inline?: boolean;
}

export interface SvelteNodeViewControls {
  delete: () => void;
}

type Attrs = Record<string, any>;

type RequiredProps = {
  attrs: Attrs;
  controls?: SvelteNodeViewControls
}

export type SvelteComponentConstructor = new (options:IComponentOptions<RequiredProps>) => SvelteComponent;

type Options = {
  name: string;
}

export function createSvelteNodeView(constructor: SvelteComponentConstructor, options: Options) {
  return (node: Node, view: EditorView, getPos: () => number): NodeView =>
    new SvelteNodeView(constructor, options, node, view, getPos);
}

export default class SvelteNodeView implements NodeView {

  dom: HTMLElement;
  component: SvelteComponent;
  view: EditorView;
  getPos: () => number;
  unbind: () => void;

  constructor(constructor: SvelteComponentConstructor, options: Options, node: Node, view: EditorView, getPos: () => number) {
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement('div');
    this.dom.classList.add('svelte-node-view');
    this.dom.classList.add(`svelte-node-view--${options.name}`);

    this.component = new constructor({
      target: this.dom,
      props: {
        attrs: node.attrs,
        controls: {
          delete: () => this.deleteNode()
        }
      }
    });

    const bindCallback = (attrs: Attrs) => {
      const transaction = view.state.tr.setNodeMarkup(getPos(), null, attrs);
      view.dispatch(transaction);
    };

    const index = this.component.$$.props['attrs'];
    this.component.$$.bound[index] = bindCallback;

    const onClick = () => {
      const tr = view.state.tr.setSelection(
        new NodeSelection(view.state.doc.resolve(getPos()))
      );
      view.dispatch(tr);
    };

    this.dom.addEventListener('click', onClick);
    this.unbind = () => this.dom.removeEventListener('click', onClick);
  }

  deleteNode() {
    const transaction = this.view.state.tr.delete(this.getPos(), this.getPos() + 1);
    this.view.dispatch(transaction);
  }

  ignoreMutation() { return true; }

  stopEvent(e: Event) {
    if (e instanceof DragEvent) return false;
    return true;
  }

  destroy() {
    this.unbind();
    window.setTimeout(() => this.component.$destroy());
    this.dom.remove();
  }
}
