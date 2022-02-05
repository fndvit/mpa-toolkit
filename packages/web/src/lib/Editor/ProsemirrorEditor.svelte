<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { EditorView } from 'prosemirror-view';
  import type { EditorState } from 'prosemirror-state';
  
  const dispatch = createEventDispatcher();

  export let className = 'ui-editor';
  export let editorState: EditorState;  
  export let placeholder = '';  
  export let view: EditorView | null = null;
  export let debounceChangeEventsInterval = 0; // 0 = disabled
  export let editor: HTMLDivElement = null;
  export let editorViewProps = {};

  console.log(editorState);
  
  export function focus() {
    console.log('focus');
    view && view.focus();
  }
  
  export function blur() {
    console.log('blur');
    editor && editor.blur();
  }
  /** Tracks the timeout id of the last time the change event was dispatched */
  let dispatchLastEditTimeout;
  /** Tracks whether changes to editor state were not yet dispatched */
  let isDirty = false;
  $: if (view && editorState && !isDirty) {
    view.updateState(editorState); // necessary to keep the DOM in sync with the editor state on external updates
  }
  /** Tracks whether the editor is empty (i.e. has a content size of 0) */
  let editorIsEmpty;
  $: editorIsEmpty = editorState
    ? editorState.doc.content.size === 0 ||
      (editorState.doc.textContent === '' && editorState.doc.content.size < 3)
    : true;
  /** Dispatches a change event and resets whether the editor state is dirty */
  // const dispatchChangeEvent = () => {
  //   if (isDirty) {
  //     dispatch('change', { editorState });
  //     isDirty = false;
  //   }
  // };
  /**
   * Captures custom events from plugins and dispatches them with a new event type (based on event.detail.type)
   * @param event {CustomEvent}
   */
  const onCustomEvent = (event) => {
    if (event.detail) {
      const { type, ...detail } = event.detail;
      dispatch(type || 'custom', detail);
    }
  };
  onMount(() => {
    view = new EditorView(
      { mount: editor },
      {
        ...editorViewProps,
        state: editorState,
        dispatchTransaction: (transaction) => {
          editorState = view.state.apply(transaction);
          // const contentHasChanged = !editorState.doc.eq(view.state.doc);
          // const selectionHasChanged = !editorState.selection.eq(view.state.selection);
          // console.log('selectionHasChanged', selectionHasChanged);
          // // console.log('dispatchTransaction contentHasChanged?', contentHasChanged);
          // // console.log('transation', transaction);
          // if (contentHasChanged) {
          //   isDirty = true;
          // }
          // if (contentHasChanged || selectionHasChanged) {
          //   isDirty = true;  
          //   if (debounceChangeEventsInterval > 0) {
          //     if (dispatchLastEditTimeout) clearTimeout(dispatchLastEditTimeout);
          //     dispatchLastEditTimeout = setTimeout(dispatchChangeEvent, 50);
          //   } else {
          //     setTimeout(dispatchChangeEvent, 0);
          //   }
          // }
          view.updateState(editorState);
          // dispatch('transaction', { view, editorState, isDirty, contentHasChanged });
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
  on:custom={onCustomEvent}
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
  :global(.ProseMirror) pre {
    white-space: pre-wrap;
  }
  :global(.ProseMirror) li {
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
