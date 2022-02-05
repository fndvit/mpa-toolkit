<script lang="ts">
  import type { EditorState, Transaction } from 'prosemirror-state';
  import BlockButton from './BlockButton.svelte';
  import MarkButton from './MarkButton.svelte';
  import MenuSeperator from './MenuSeperator.svelte';
  import { schema } from './schema';

  export let editorState: EditorState;
  export let dispatchTransaction: (tr: Transaction) => void;
</script>

<div class="menu-bar">
  <MarkButton {editorState} {dispatchTransaction} markType={schema.marks.strong} icon="format_bold" />
  <MarkButton {editorState} {dispatchTransaction} markType={schema.marks.em} icon="format_italic" />
  <MenuSeperator />
  <BlockButton {editorState} {dispatchTransaction} nodeType={schema.nodes.heading} text="H" />
  <BlockButton {editorState} {dispatchTransaction} nodeType={schema.nodes.paragraph} text="¶" />
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
