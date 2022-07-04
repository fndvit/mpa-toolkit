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
  href={ !cms && `/tag/${slugify(tag.value)}`}
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
      {#if cms && style === 'PRIMARY'}
        <svg width="20" height="15">
          <path d="M 14.9215 4.5128 L 15.4871 5.0784 L 5.0783 15.4864 L 4.5127 14.9212 L 14.9215 4.5128 Z"></path>
          <path d="M 5.0783 4.5128 L 15.4871 14.9208 L 14.9215 15.4868 L 4.5127 5.0788 L 5.0783 4.5128 Z"></path>
        </svg>
      {/if}
    {/if}
  </span>
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

    span {
      typography: ui-small;
      position: relative;
    }

    svg {

      padding-left: 10px;
    }
  }
  .tag:hover {
    text-decoration: none;
    filter: brightness(105%);
  }
</style>