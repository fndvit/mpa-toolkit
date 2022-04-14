<script lang="ts">
  import type { EditorState } from 'prosemirror-state';
  import type { EditorView } from 'prosemirror-view';
  import { getContext } from 'svelte';
  import BlockButton from './BlockButton.svelte';
  import { addCard } from './cards';
  import MarkButton from './MarkButton.svelte';
  import MenuButton from './MenuButton.svelte';
  import MenuSeperator from './MenuSeperator.svelte';
  import { schema } from './schema';
  import UploadButton from './UploadButton.svelte';

  export let editorState: EditorState;

  const view = getContext('editorView') as EditorView;

  const insertCards = () => {
    const tr = editorState.tr.replaceSelectionWith(schema.nodes.cards.createAndFill());
    view.dispatch(tr);
  }

</script>

<div class="menu-bar">
  <MarkButton {editorState} markType={schema.marks.strong} icon="format_bold" />
  <MarkButton {editorState} markType={schema.marks.em} icon="format_italic" />
  <MenuSeperator />
  <BlockButton {editorState} nodeType={schema.nodes.heading} attrs={{level: 1}} text="H1" />
  <BlockButton {editorState} nodeType={schema.nodes.heading} attrs={{level: 2}} text="H2" />
  <BlockButton {editorState} nodeType={schema.nodes.paragraph} text="¶" />
  <MenuSeperator />
  <MenuButton on:click={insertCards} icon="article" />
  <MenuButton on:click={() => addCard(editorState, view.dispatch)} icon="library_add" />
  <MenuSeperator />
  <UploadButton />
</div>

<style>
  .menu-bar {
    position: sticky;
    top: 0;
    z-index: 1;
    width: 100%;
    display: flex;
    padding: 0.5rem;
    column-gap: 0.4rem;
    border-bottom: 1px solid #ccc;
    background: #f7f7f7;
    box-sizing: border-box;

  }
</style>
