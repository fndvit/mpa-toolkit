<script lang="ts">
  import type { EditorState } from 'prosemirror-state';
  import type { EditorView } from 'prosemirror-view';
  import { createEventDispatcher, getContext } from 'svelte';
  import MarkButton from './MarkButton.svelte';
  import MenuSeperator from './MenuSeperator.svelte';
  import BlockButton from './BlockButton.svelte';
  import ListControls from './ListControls.svelte';
  import ImageButton from './ImageButton.svelte';
  import Formatting from './Formatting.svelte';
  import HeadingBlockButton from './HeadingBlockButton.svelte';
  import AddCollapseButton from './AddCollapseButton.svelte';
  import LinkButton from './LinkButton.svelte';
  import { IconButton } from '$lib/components/generic';
  import { schema } from '$lib/editor/schema';
  import { createEmptyCard, createEmptyLinkCard, createEmptyDiagram } from '$lib/helpers/content';
  import { editorStore } from '../editorStore';
  import Button from '$lib/components/generic/Button.svelte';
  import LoadingButton from '$lib/components/generic/LoadingButton.svelte';

  export let editorState: EditorState;
  const dispatch = createEventDispatcher<{ save: null; delete: null }>();
  const view = getContext('editorView') as EditorView;

  const insertCards = () => {
    const tr = editorState.tr.replaceSelectionWith(schema.nodes.cards.createAndFill(createEmptyCard()));
    view.dispatch(tr);
  };

  const insertLinkCards = () => {
    const tr = editorState.tr.replaceSelectionWith(schema.nodes.linkcards.createAndFill(createEmptyLinkCard()));
    view.dispatch(tr);
  };

  const insertDiagram = () => {
    const tr = editorState.tr.replaceSelectionWith(schema.nodes.diagram.createAndFill(createEmptyDiagram()));
    view.dispatch(tr);
  };

  const insertReminder = () => {
    const tr = editorState.tr.insertText('*TODO: *');
    view.dispatch(tr);
  };

  $: [{ page, preview, dirty, savedPage, saving, isNewPage, saveable }] = [$editorStore];

  $: href = `${page.draft ? '/draft' : ''}/${savedPage.slug}`;
</script>

<div class="menu-bar">
  <div class="left-section">
    <MarkButton {editorState} markType={schema.marks.strong} icon="format_bold" />
    <MarkButton {editorState} markType={schema.marks.em} icon="format_italic" />
    <LinkButton {editorState} />
    <MenuSeperator />
    <HeadingBlockButton {editorState} />
    <BlockButton {editorState} nodeType={schema.nodes.paragraph} text="¶" />
    <MenuSeperator />
    <ListControls {editorState} />
    <MenuSeperator />
    <IconButton on:click={insertCards} icon="library_books" title="Add cards" />
    <IconButton on:click={insertLinkCards} icon="add_link" title="Add link cards" />
    <IconButton on:click={insertDiagram} icon="donut_small" title="Add diagram" />
    <ImageButton title="Add image" />
    <AddCollapseButton {editorState} />
    <MenuSeperator />
    <IconButton on:click={insertReminder} icon="notifications" title="Add reminder" />
    <MenuSeperator />
  </div>

  <div class="right-section">
    <Formatting {editorState} />
    <div class="page-controls">
      {#if saving}Saving...{/if}
      <IconButton {href} rel="external" target="_blank" icon="open_in_new" title="Open link in new page" />
      <div class="draft-button">
        <IconButton
          on:click={() => (page.draft = !page.draft)}
          title={page.draft ? 'Click to publish' : 'Click to make draft'}
          icon={page.draft ? 'article' : 'public'}
          text={page.draft ? 'Draft' : 'Live'}
        />
      </div>
      <Button on:click={() => ($editorStore.preview = !preview)}>{preview ? 'Close preview' : 'Preview'}</Button>
      <div class="save-button">
        <LoadingButton on:click={() => dispatch('save')} loading={saving} disabled={!saveable}>
          {dirty ? 'Save' : 'Saved'}
        </LoadingButton>
      </div>
      {#if !isNewPage}
        <div class="delete-button">
          <Button on:click={() => dispatch('delete')}>Delete</Button>
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  .menu-bar {
    --ib-icon-bg: transparent;
    --ib-hover-border: 1px solid #ddd;
    --ib-hover-bg: transparent;
    --ib-active-bg: white;
    --ib-active-border: 1px solid #ccc;

    position: sticky;
    display: flex;
    top: 0;
    z-index: $z-editor-menubar;
    width: 100%;
    padding: 0.5rem;
    border-bottom: 1px solid #ccc;
    background: $c-neutral-bg;
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

  .page-controls {
    display: flex;
    column-gap: 10px;
    align-items: center;
    font: $f-ui-small;

    :global(.message) {
      margin-right: 10px;
      color: #999;
    }
    @keyframes bg-pulse {
      0% {
        border-color: #bbb;
      }

      100% {
        border-color: #999;
        box-shadow: inset #a0b6e455 0 0 15px 0, #c5cddf 0 0 2px 1px;
      }
    }

    .save-button :global(.button:not(:disabled)) {
      animation: 1s ease-in 0s infinite alternate bg-pulse;
    }

    .draft-button {
      :global(.icon-button) {
        column-gap: 0;
      }
    }
  }
</style>
