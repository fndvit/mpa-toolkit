<script lang="ts">
  import type { Tag } from '@mpa/db';
  import { Tag as TagComponent } from '$lib/components/shared';

  export let tags: Tag[] = [];
  export let activeTags: Tag[] = [];

  let activeTagSet = new Set<Tag>();

  $: unselectedTags = tags.filter(tag => !activeTags.includes(tag));

  function onClickTag(tag: Tag) {
    if (activeTagSet.has(tag)) activeTagSet.delete(tag);
    else activeTagSet.add(tag);

    activeTags = Array.from(activeTagSet);
  }
</script>

<div class="tag-filter">
  {#if activeTags.length > 0}
    {#each activeTags as tag}
      <TagComponent {tag} style={'PRIMARY'} on:click={() => onClickTag(tag)} cms />
    {/each}
  {/if}
  {#each unselectedTags as tag}
    <TagComponent {tag} style={'SECONDARY'} on:click={() => onClickTag(tag)} cms />
  {/each}
</div>

<style lang="postcss">
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
