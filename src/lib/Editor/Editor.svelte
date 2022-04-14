<script lang="ts">
  import ProsemirrorEditor from '$lib/Editor/ProsemirrorEditor.svelte';
  import { EditorState } from 'prosemirror-state';
  import type { EditorView } from 'prosemirror-view';
  import { onMount, setContext } from 'svelte';
  import EditorMenu from './EditorMenu.svelte';
  import { corePlugins, richTextPlugins } from './plugins';
  import { schema } from './schema';

  let focusEditor: () => void;
  let view: EditorView;

  export let initialDoc: {[key: string]: any} = null;

  let editorState = EditorState.create({
    schema,
    doc: initialDoc ? schema.nodeFromJSON(initialDoc) : undefined,
    // selection,
    plugins: [
      ...corePlugins,
      ...richTextPlugins
      // ...plugins
    ]
  });

  function handleChange(event) {
  }

  export function getDocumentJson() {
    return editorState.doc.toJSON();
  }

  $: setContext('editorView', view);

  onMount(() => focusEditor());
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
</svelte:head>

{#if view}
  <EditorMenu {editorState} on:change={handleChange} />
{/if}

<div class="prosemirror-container">
  <ProsemirrorEditor bind:editorState on:change={handleChange} bind:view bind:focus={focusEditor} />
</div>

<style lang="scss">
  .prosemirror-container {
    width: 40rem;
    margin: 0 auto;
    text-align: left;
    font-family: 'Montserrat', sans-serif;
    --heading-color: #000;
    :global(h1), :global(h2) {
      font-weight: 300;
    }
    :global(h1) {
      font-size: 3rem;
    }
    :global(h2) {
      font-size: 2rem;
    }
    :global(p) {
      font-weight: 400;
      font-size: 1.125rem;
    }
    :global(cards) {
      display: flex;
      flex-direction: column;
      row-gap: 0.1rem;
    }
    :global(cards:not(.selected) card:not(:first-child)) {
      display: none;
    }
    :global(card) {
      display: block;
      background: #096EAE;
      color: white;
      padding: 0 2rem;
      padding-bottom: 1rem;
      font-size: 1rem;
      border-radius: 20px 20px 0px 0px;
      :global(h3), :global(p) {
        color: white;
      }
      :global(h3) {
        margin-bottom: 1rem;
      }
      :global(p) {
        font-size: 1rem;
      }
    }
  }

  :global(.material-icons) {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px; /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
  }
</style>
