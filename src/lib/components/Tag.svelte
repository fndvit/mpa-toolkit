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
  <span class="font-ui-small">
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
    text-align: center;
    padding: 2px 12px 4px;
    border-radius: 18px;
    overflow: hidden;
    margin: 0;
    color: black;
    position: relative;
    white-space: nowrap;
    height: fit-content;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: var(--tag-bg, #fbe26b);
    }
    &.secondary::before {
      opacity: var(--tag-bg-fade, 0.4);
    }
    span {
      position: relative;
    }
  }
  .tag:hover {
    box-shadow: inset 0px 2px 12px rgba(0, 0, 0, 0.2);
  }
</style>