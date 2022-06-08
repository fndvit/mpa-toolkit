<script lang="ts">
  import { plugins } from '$lib/editor/plugins';
  import { simpleSchema as schema } from '$lib/editor/schema';
  import { DOMParser, DOMSerializer, Node } from 'prosemirror-model';
  import { EditorState } from 'prosemirror-state';
  import { EditorView } from 'prosemirror-view';
  import { createEventDispatcher, onDestroy,onMount } from 'svelte';

  export let content: string;
  export let view: EditorView | null = null;
  export let placeholder = '';

  const dispatch = createEventDispatcher<{complete: null}>();

  let editor: HTMLDivElement = null;
  const serializer = DOMSerializer.fromSchema(schema);
  const d = document.createElement('div');

  const htmlToNode = (html: string) => {
    d.innerHTML = html;
    return DOMParser.fromSchema(schema).parse(d);
  };

  const docToHTML = (n: Node) => {
    if (n.textContent.length === 0) {
      return '';
    }
    const span = n.maybeChild(0);
    const el = serializer.serializeNode(span);
    if (el instanceof HTMLElement) {
      return el.innerHTML;
    } else {
      throw new Error('Not a HTMLElement');
    }
  };

  let editorState = EditorState.create({
    schema,
    doc: htmlToNode(content || ''),
    plugins: [ ...plugins(schema) ]
  });

  $: content = docToHTML(editorState.doc);

  onMount(() => {
    view = new EditorView(
      { mount: editor },
      {
        state: editorState,
        dispatchTransaction: tr => {
          if (view) {
            editorState = view.state.apply(tr);
            view.updateState(editorState);
          }
        },
        handleDOMEvents: {
          keydown: (_, e: KeyboardEvent) => e.key === 'Enter' && dispatch('complete')
        },
      }
    );
    view.focus();
  });


  onDestroy(() => view?.destroy());

</script>

<div
  class="mini-editor"
  class:ProseMirror={true}
  data-placeholder={placeholder}
  bind:this={editor}
/>

<style lang="scss">

  .mini-editor {
    --ui-color-placeholder: #{color(editor-placeholder)};
    position: relative;
    word-wrap: break-word;
    white-space: pre-wrap;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;

    &:global(.ProseMirror-hideselection *::selection) {
      background: transparent;
    }
    &:global(.ProseMirror-hideselection *::-moz-selection) {
      background: transparent;
    }
    &:global(.ProseMirror-hideselection) {
      caret-color: transparent;
    }
    &:global(.ProseMirror-selectednode) {
      outline: 2px solid #8cf;
    }
    &:global(.ProseMirror .empty-node::before) {
      position: absolute;
      color: #aaa;
      cursor: text;
    }
    &:global(.ProseMirror .empty-node:hover::before) {
      color: #777;
    }
    &:global(.ProseMirror-empty::before) {
      position: absolute;
      content: attr(data-placeholder);
      pointer-events: none;
      color: var(--ui-color-placeholder);
    }
  }


</style>
