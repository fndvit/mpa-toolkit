<script lang="ts">
  import type { ContentDocument } from '@mpa/db';
  import { EditorState } from 'prosemirror-state';
  import { svelteNodeViewPlugin } from 'prosemirror-svelte-nodeview';
  import type { EditorView } from 'prosemirror-view';
  import { onMount, setContext } from 'svelte';
  import EditorMenu from './toolbar/EditorMenu.svelte';
  import { DiagramView, CardsView, ImageView, LinkCardsView, ExpandButtonView } from './nodeview';
  import ProsemirrorEditor from './ProsemirrorEditor.svelte';
  import FormattingTooltip from './FormattingTooltip.svelte';
  import LinkTooltip from './LinkTooltip.svelte';
  import { schema } from '$lib/editor/schema';
  import { plugins } from '$lib/editor/plugins';
  import { LinkPlugin } from './linkTooltip';

  let focusEditor: () => void;
  let view: EditorView;

  export let content: ContentDocument = null;

  const linkPlugin = new LinkPlugin();

  let editorState = EditorState.create({
    schema,
    doc: content ? schema.nodeFromJSON(content) : undefined,
    plugins: [
      ...plugins(schema),
      linkPlugin,
      svelteNodeViewPlugin({
        nodes: {
          linkcards: LinkCardsView,
          cards: CardsView,
          image: ImageView,
          diagram: DiagramView,
          collapse: ExpandButtonView
        }
      })
    ]
  });

  onMount(() => focusEditor());

  $: content = editorState.doc.toJSON() as ContentDocument;
  $: setContext('editorView', view);
</script>

{#if view}
  <EditorMenu {editorState} on:save on:delete />
{/if}
<div class="editor-content">
  <div class="prosemirror-container">
    <ProsemirrorEditor bind:editorState bind:view bind:focus={focusEditor} />
    {#if view}
      <FormattingTooltip {editorState} />
      <LinkTooltip {view} plugin={linkPlugin} {editorState} />
    {/if}
  </div>
</div>

<style lang="postcss">
  .editor-content {
    display: grid;
    grid-template-columns: 70% auto;
    column-gap: 1rem;
  }

  .prosemirror-container {
    position: relative;
    width: 40rem;
    margin: 0 auto;
    text-align: left;
    font-family: var(--font-sans-serif);

    --heading-color: #000;

    :global(h1),
    :global(h2) {
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
  }
</style>
