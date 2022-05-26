<script lang="ts">
  import type { Node } from 'prosemirror-model';
  import type { EditorState } from 'prosemirror-state';
  import CardsView from '$lib/editor/cardsview';
  import { EditorView } from 'prosemirror-view';
  import { onDestroy,onMount } from 'svelte';

  export let className = 'ui-editor';
  export let editorState: EditorState;
  export let placeholder = '';
  export let view: EditorView | null = null;
  export let editor: HTMLDivElement = null;
  export let editorViewProps = {};

  export function focus() {
    view && view.focus();
  }

  export function blur() {
    editor && editor.blur();
  }

  $: if (view && editorState) {
    view.updateState(editorState);
  }

  let editorIsEmpty: boolean;
  $: editorIsEmpty = editorState
    ? editorState.doc.content.size === 0 ||
      (editorState.doc.textContent === '' && editorState.doc.content.size < 3)
    : true;

  onMount(() => {
    view = new EditorView(
      { mount: editor },
      {
        ...editorViewProps,
        state: editorState,
        dispatchTransaction: (transaction) => {
          if (view) {
            editorState = view.state.apply(transaction);
            view.updateState(editorState);
          }
        },
        nodeViews: {
          cards: (node: Node, view: EditorView, getPos: () => number) => new CardsView(node, view, getPos)
        }
      }
    );
  });

  onDestroy(() => {
    if (view) view.destroy();
  });

</script>

<div
  class={className}
  class:ProseMirror={true}
  class:editor_empty={editorIsEmpty}
  data-placeholder={placeholder}
  bind:this={editor}
  on:focus
  on:blur
  on:keydown
/>

<style>
  :global(body) {
    --ui-color-placeholder: #aaaaaa;
  }
  :global(.ProseMirror) {
    position: relative;
  }
  :global(.ProseMirror) {
    word-wrap: break-word;
    white-space: pre-wrap;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
  }
  :global(.ProseMirror pre) {
    white-space: pre-wrap;
  }
  :global(.ProseMirror li) {
    position: relative;
  }
  :global(.ProseMirror h1) {
    text-align: left;
  }

  :global(.ProseMirror-hideselection *::selection) {
    background: transparent;
  }
  :global(.ProseMirror-hideselection *::-moz-selection) {
    background: transparent;
  }
  :global(.ProseMirror-hideselection) {
    caret-color: transparent;
  }
  :global(.ProseMirror-selectednode) {
    outline: 2px solid #8cf;
  }
  /* Make sure li selections wrap around markers */
  :global(li.ProseMirror-selectednode) {
    outline: none;
  }
  :global(li.ProseMirror-selectednode:after) {
    content: '';
    position: absolute;
    left: -32px;
    right: -2px;
    top: -2px;
    bottom: -2px;
    border: 2px solid #8cf;
    pointer-events: none;
  }
  :global(.ProseMirror .empty-node::before) {
    position: absolute;
    color: #aaa;
    cursor: text;
  }
  :global(.ProseMirror .empty-node:hover::before) {
    color: #777;
  }
  :global(.ProseMirror.editor_empty::before) {
    position: absolute;
    content: attr(data-placeholder);
    pointer-events: none;
    color: var(--ui-color-placeholder);
  }

  .ui-editor {
    box-sizing: border-box;
    background-color: transparent;
    padding: 1em;
    /* border: 1px solid #efefef;
    border-radius: .5em; */
    background: white;
    display: inline-block;
    font: inherit;
    text-rendering: optimizeLegibility;
    white-space: pre-line;
    overflow-wrap: break-spaces;
    vertical-align: top;
    width: 100%;
    min-height: 1.25rem;
    outline: none;
  }
</style>
