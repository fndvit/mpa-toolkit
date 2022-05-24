<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import Tag from "$lib/components/Tag.svelte";

  export let tags: SubTypes.PageTag[] = [];
</script>

<div class="tag-container">
  {#each tags as tag}
    <Tag {tag}/>
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