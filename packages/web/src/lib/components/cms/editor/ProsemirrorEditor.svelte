<script lang="ts">
  import type { EditorState } from 'prosemirror-state';
  import { EditorView } from 'prosemirror-view';
  import { onDestroy, onMount } from 'svelte';

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
    ? editorState.doc.content.size === 0 || (editorState.doc.textContent === '' && editorState.doc.content.size < 3)
    : true;

  onMount(() => {
    view = new EditorView(
      { mount: editor },
      {
        ...editorViewProps,
        state: editorState,
        dispatchTransaction: transaction => {
          if (view) {
            editorState = view.state.apply(transaction);
            view.updateState(editorState);
          }
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

<style lang="postcss">
  :global(.ProseMirror) {
    --editable-placeholder-color: $c-editor-placeholder;

    position: relative;
    word-wrap: break-word;
    white-space: pre-wrap;
    font-variant-ligatures: none;

    :global(a) {
      cursor: pointer;
    }

    :global(pre) {
      white-space: pre-wrap;
    }

    :global(li) {
      position: relative;
    }

    :global(h1) {
      text-align: left;
    }

    :global(.empty-node::before) {
      position: absolute;
      color: #aaa;
      cursor: text;
    }

    :global(.empty-node:hover::before) {
      color: #777;
    }
  }

  :global(.ProseMirror-hideselection *::selection) {
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

  :global(li.ProseMirror-selectednode::after) {
    content: '';
    position: absolute;
    left: -32px;
    right: -2px;
    top: -2px;
    bottom: -2px;
    border: 2px solid #8cf;
    pointer-events: none;
  }

  :global(.ProseMirror.editor_empty::before) {
    position: absolute;
    content: attr(data-placeholder);
    pointer-events: none;
    color: var(--editable-placeholder-color);
  }

  .ui-editor {
    box-sizing: border-box;
    padding: 1em;
    background: white;
    display: inline-block;
    font: inherit;
    text-rendering: optimizelegibility;
    white-space: pre-line;
    overflow-wrap: break-spaces;
    vertical-align: top;
    width: 100%;
    min-height: 1.25rem;
    outline: none;
  }
</style>
