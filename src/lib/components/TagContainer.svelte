<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import Tag from "$lib/components/Tag.svelte";

  export let tags: SubTypes.PageTag[] = [];
  export let currentTagHovered = null;
</script>

<div class="tag-container">
  {#each tags as tag}
    <Tag
      {tag}
      on:mouseenter={() => currentTagHovered = tag.tag.id}
      on:mouseleave={() => currentTagHovered = null}
    />
  {/each}
</div>

<style lang="scss">
  .tag-container {
    --tag-spacing: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    column-gap: var(--tag-spacing);
    row-gap: var(--tag-spacing);
    > :global(*) {
      flex: 0 0 auto;
    }
  }
</style>