<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import Tag from "$lib/components/Tag.svelte";

  export let tags: SubTypes.Tag[] = [];
  export let activeTags: SubTypes.Tag[] = [];

  let activeTagSet = new Set<SubTypes.Tag>();
  const cms = true;

  $: unselectedTags = tags.filter(tag => !activeTags.includes(tag));

  function onClickTag(tag: SubTypes.Tag) {
    if (activeTagSet.has(tag)) activeTagSet.delete(tag);
    else activeTagSet.add(tag);

    activeTags = Array.from(activeTagSet);
  }

</script>

<div class="tag-filter">
  {#if activeTags.length > 0}
    {#each activeTags as tag}
      <Tag tag={tag} style={'PRIMARY'} on:click={() => onClickTag(tag)} {cms} />
    {/each}
  {/if}
  {#each unselectedTags as tag}
    <Tag tag={tag} style={'SECONDARY'} on:click={() => onClickTag(tag)} {cms} />
  {/each}
</div>

<style lang="stylus">
  .tag-filter {
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