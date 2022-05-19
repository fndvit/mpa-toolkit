<script lang="ts">
  import IconButton from '$lib/components/IconButton.svelte';
  import type { EditorState } from 'prosemirror-state';
  import type { EditorView } from 'prosemirror-view';
  import { getContext } from 'svelte';
  import BlockButton from './BlockButton.svelte';
  import { addCard } from './cards';
  import MarkButton from './MarkButton.svelte';
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
  <div class="left-section">
    <MarkButton {editorState} markType={schema.marks.strong} icon="format_bold" />
    <MarkButton {editorState} markType={schema.marks.em} icon="format_italic" />
    <MenuSeperator />
    <BlockButton {editorState} nodeType={schema.nodes.heading} attrs={{level: 1}} text="H1" />
    <BlockButton {editorState} nodeType={schema.nodes.heading} attrs={{level: 2}} text="H2" />
    <BlockButton {editorState} nodeType={schema.nodes.paragraph} text="¶" />
    <MenuSeperator />
    <IconButton on:click={insertCards} icon="article" title="Add cards" />
    <IconButton on:click={() => addCard(editorState, view.dispatch)} icon="library_add" title="Add card" />
    <MenuSeperator />
    <UploadButton />
  </div>

  <div class="right-section">
    <slot name="extra-controls"/>
  </div>
</div>

<style>
  .menu-bar {
    --ib-icon-bg: transparent;
    --color: #333;
    --ib-hover-border: 1px solid #ddd;
    --ib-hover-bg: transparent;

    position: sticky;
    display: flex;
    top: 0;
    z-index: 1;
    width: 100%;
    padding: 0.5rem;
    border-bottom: 1px solid #ccc;
    background: #f7f7f7;
    box-sizing: border-box;
  }

  .left-section {
    --ib-font-size: 0.8rem;
  }

  .left-section,
  .right-section {
    display: flex;
    column-gap: 0.4rem;
  }

  .right-section {
    flex: 1;
    justify-content: end;
  }
</style>
