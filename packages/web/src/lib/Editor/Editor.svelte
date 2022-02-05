<script lang="ts">
  import ProsemirrorEditor from '$lib/Editor/ProsemirrorEditor.svelte';
  import { EditorState } from 'prosemirror-state';
  import type { EditorView } from 'prosemirror-view';
  import { onMount } from 'svelte';
  import EditorMenu from './EditorMenu.svelte';
  import { corePlugins, richTextPlugins } from './plugins';
  import { schema } from './schema';

  let focusEditor: () => void;
  let view: EditorView;

  let editorState = EditorState.create({
    schema,
    // doc,
    // selection,
    plugins: [
      ...corePlugins,
      ...richTextPlugins
      // ...plugins
    ]
  });

  function handleChange(event) {
  }

  onMount(() => focusEditor());
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,700;1,400;1,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{#if view}
<EditorMenu {editorState} dispatchTransaction={view.dispatch} on:change={handleChange} />
{/if}

<div class="editor-container">
  <ProsemirrorEditor bind:editorState on:change={handleChange} bind:view />
</div>

<style lang="scss">
  .editor-container {
    width: 40rem;
    margin: 0 auto;
    text-align: left;
    font-family: 'Montserrat', sans-serif;
    --heading-color: #000;
    :global(h1) {
      font-weight: 300;
      font-size: 3rem;
    }
    :global(p) {
      font-weight: 400;
      font-size: 1.125rem;
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
