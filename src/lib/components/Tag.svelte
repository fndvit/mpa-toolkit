<script lang="ts">
  import type { SubTypes, Tag } from "$lib/types";
  import { slugify } from "$lib/helpers/utils";
  import { getContext } from "svelte";

  export let tag: SubTypes.PageTag;

  const tagHighlightFn = getContext<(tag: Tag) => string>('tagHighlightFn');

  $: highlight = tagHighlightFn && tagHighlightFn(tag.tag);

  $: secondary = tag.category == 'SECONDARY';
</script>

<a
  href={`/tag/${slugify(tag.tag.value)}`}
  class="tag"
  class:secondary
  tabindex="0"
  style=""
  on:mouseenter
  on:mouseleave
>
  <span>
    {#if highlight}
      {@html highlight}
    {:else}
      {tag.tag.value}
    {/if}
  </span>
</a>

<style lang="scss">
  .tag {
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
    font-family: 'Montserrat';
    font-weight: 400;
    line-height: 18px;
    text-align: center;
    padding: 4px 12px;
    border-radius: 18px;
    overflow: hidden;
    margin: 0;
    color: black;
    position: relative;
    white-space: nowrap;
    height: fit-content;
    background: color(highlight-1);
    &.secondary {
      background: color(highlight-1, 0.4);
    }

    :global(.collection-card) &,
    :global(.content-carousel-card) & {
      background: color(tag-bg-cards);
      &.secondary {
        background: color(tag-bg-cards, 0.4);
      }
    }

    span {
      position: relative;
    }
  }
  .tag:hover {
    box-shadow: inset 0px 2px 12px rgba(0, 0, 0, 0.2);
  }
</style>