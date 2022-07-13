<script lang="ts">
  import type { SubTypes, Tag } from "$lib/types";
  import { slugify } from "$lib/helpers/utils";
  import { getContext } from "svelte";

  type TagStyles = 'PRIMARY' | 'SECONDARY';

  export let tag: SubTypes.Tag;
  export let style: TagStyles;
  export let cms = false;

  const tagName = cms ? 'button' : 'a';
  const tagHighlightFn = getContext<(tag: Tag) => string>('tagHighlightFn');

  $: highlight = tagHighlightFn && tagHighlightFn(tag);

  $: secondary = style === 'SECONDARY';

</script>

<svelte:element
  this={tagName}
  href={ cms ? undefined :  `/tag/${slugify(tag.value)}`}
  class="tag {secondary ? 'secondary' : ''} "
  tabindex="0"
  on:mouseenter
  on:mouseleave
  on:click
>
  <span>
    {#if highlight}
      {@html highlight}
    {:else}
      {tag.value}
    {/if}
  </span>
  {#if cms && style === 'PRIMARY'}
    <span class="material-icons">close</span>
  {/if}
</svelte:element>

<style lang="stylus">
  .tag {
    cursor: pointer;
    display: inline-block;
    text-align: center;
    padding: 2px 12px 4px;
    border-radius: 18px;
    border: none;
    overflow: hidden;
    margin: 0;
    color: black;
    position: relative;
    white-space: nowrap;
    height: fit-content;
    width: fit-content;
    background: $colors.highlight-1;
    &.secondary {
      background: alpha($colors.highlight-1, 0.4);
    }

    :global(.collection-card) &,
    :global(.content-carousel-card) & {
      background: $colors.tag-bg-cards;
      &.secondary {
        background: alpha($colors.tag-bg-cards, 0.4);
      }
    }

    span:first-child {
      typography: ui-small;
      position: relative;
    }

    .material-icons {
      font-size: 14px;
      vertical-align: middle;
    }
  }
  .tag:hover {
    text-decoration: none;
    filter: brightness(105%);
  }
</style>