<script lang="ts">
  import type { ContentDocument } from '@mpa/db';
  import { EditorState } from 'prosemirror-state';
  import { svelteNodeViewPlugin } from 'prosemirror-svelte-nodeview';
  import type { EditorView } from 'prosemirror-view';
  import { onMount, setContext } from 'svelte';
  import EditorMenu from './toolbar/EditorMenu.svelte';
  import { DiagramView, CardsView, ImageView, HeadingView, LinkCardsView } from './nodeview';
  import ProsemirrorEditor from './ProsemirrorEditor.svelte';
  import { schema } from '$lib/editor/schema';
  import { plugins } from '$lib/editor/plugins';

  let focusEditor: () => void;
  let view: EditorView;

  export let content: ContentDocument = null;

  let editorState = EditorState.create({
    schema,
    doc: content ? schema.nodeFromJSON(content) : undefined,
    plugins: [
      ...plugins(schema),
      svelteNodeViewPlugin({
        nodes: {
          linkCards: LinkCardsView,
          cards: CardsView,
          image: ImageView,
          heading: HeadingView,
          diagram: DiagramView
        }
      })
    ]
  });

  $: content = editorState.doc.toJSON() as ContentDocument;

  $: setContext('editorView', view);

  onMount(() => focusEditor());
</script>

{#if view}
  <EditorMenu {editorState}>
    <slot name="menu-extra" slot="extra-controls" />
  </EditorMenu>
{/if}
<div class="editor-content">
  <div class="prosemirror-container">
    <ProsemirrorEditor bind:editorState bind:view bind:focus={focusEditor} />
  </div>
</div>

<style lang="postcss">
  .editor-content {
    display: grid;
    grid-template-columns: 70% auto;
    column-gap: 1rem;
  }

  .prosemirror-container {
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
