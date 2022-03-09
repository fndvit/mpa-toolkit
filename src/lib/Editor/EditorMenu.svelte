<script lang="ts">
  import type { EditorState, Transaction } from 'prosemirror-state';
  import BlockButton from './BlockButton.svelte';
  import { addCard } from './cards';
  import MarkButton from './MarkButton.svelte';
  import MenuButton from './MenuButton.svelte'; 
  import MenuSeperator from './MenuSeperator.svelte';
  import { schema } from './schema';

  export let editorState: EditorState;
  export let dispatchTransaction: (tr: Transaction) => void;

  const insertCards = () => {
    const tr = editorState.tr.replaceSelectionWith(schema.nodes.cards.createAndFill());
    dispatchTransaction(tr);
  }

</script>

<div class="menu-bar">
  <MarkButton {editorState} {dispatchTransaction} markType={schema.marks.strong} icon="format_bold" />
  <MarkButton {editorState} {dispatchTransaction} markType={schema.marks.em} icon="format_italic" />
  <MenuSeperator />
  <BlockButton {editorState} {dispatchTransaction} nodeType={schema.nodes.heading} attrs={{level: 1}} text="H1" />
  <BlockButton {editorState} {dispatchTransaction} nodeType={schema.nodes.heading} attrs={{level: 2}} text="H2" />
  <BlockButton {editorState} {dispatchTransaction} nodeType={schema.nodes.paragraph} text="¶" />
  <MenuSeperator />
  <MenuButton on:click={insertCards} icon="article" />
  <MenuButton on:click={() => addCard(editorState, dispatchTransaction)} icon="library_add" />
</div>

<style>
  .menu-bar {
    width: 100%;
    display: flex;
    padding: 0.5rem;
    column-gap: 0.4rem;
    border-bottom: 1px solid #ccc;
    background: #f7f7f7;
    box-sizing: border-box;
  }
</style>
