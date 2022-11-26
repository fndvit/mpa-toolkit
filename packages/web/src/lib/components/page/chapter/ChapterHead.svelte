<script lang="ts">
  import type { Chapter, PageTag } from '@mpa/db';
  import LifeCycle from '../shared/LifeCycle.svelte';
  import Authors from './Authors.svelte';
  import KeyTakeaways from './KeyTakeaways.svelte';
  import { EditableText } from '$lib/components/generic';

  export let chapter: Chapter;
  export let tags: PageTag[];
  export let editable = false;
  export let readTime: number = undefined;

  if (!chapter) {
    chapter = {
      authors: [],
      keyTakeaways: [],
      summary: ''
    };
  }

  $: hasKeyTakeaways = editable || chapter.keyTakeaways?.length > 0;
</script>

<div class="chapter-head" class:meta-editable={editable} class:has-keytakeaways={hasKeyTakeaways}>
  <div class="byline">
    <Authors bind:authors={chapter.authors} {editable}>
      {#if readTime !== undefined}
        <div class="readtime">{readTime} min read</div>
      {/if}
    </Authors>
  </div>

  <div class="summary">
    <EditableText bind:value={chapter.summary} {editable} placeholder="Summary text..." />
  </div>

  {#if hasKeyTakeaways}
    <div class="keytakeaways-container">
      <KeyTakeaways bind:keyTakeaways={chapter.keyTakeaways} {editable} />
    </div>
  {/if}

  {#if !editable}
    <div class="lifecycle-container">
      <LifeCycle {tags} />
    </div>
  {/if}
</div>

<style lang="postcss">
  .chapter-head:not(.has-keytakeaways) {
    @mixin grid-config content, chapter-no-keytakeaways;
  }

  .chapter-head.has-keytakeaways {
    @mixin grid-config content, chapter;
  }

  .chapter-head {
    --ui-color-placeholder: #fff5;

    padding: 2rem 0 0;
    background: $c-primary-blue;
    color: $c-neutral-bg;

    @mixin breakpoint content, medium {
      &::before {
        content: '';
        grid-column: 1 / -1;
        grid-row: -2 / -1;
        background: linear-gradient(180deg, transparent $lifecycle-overlap, white $lifecycle-overlap);
      }
    }
  }

  .byline {
    grid-area: byline;
    font: $f-ui;
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    column-gap: 10px;
  }

  .summary {
    @mixin font-responsive p-large;

    font: $f-p-large;
    grid-area: summary;
    max-width: 800px;
    margin-bottom: 40px;
  }

  .keytakeaways-container {
    grid-area: keytakeaways;
    margin: 0 0 2rem -30px;

    @mixin breakpoint content, medium {
      margin-left: 0;
    }
  }

  .lifecycle-container {
    grid-area: lifecycle;
    position: relative;

    > :global(.lifecycle) {
      position: absolute;
      z-index: $z-lifecycle;
      margin-right: -30px;
      margin-left: 20px;
      max-width: 300px;
      box-sizing: border-box;

      @mixin breakpoint content, medium {
        position: static;
        margin: 0;
        max-width: none;
      }
    }
  }

  .readtime {
    display: inline;
    font-weight: 300;
  }
</style>
