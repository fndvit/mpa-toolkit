<script lang="ts">
  import type { Page, TagType } from '@mpa/db';
  import CollectionCard from './CollectionCard.svelte';

  export let pages: Page.CollectionCard[];
  export let cms = false;
  export let tagType: TagType = 'TOPIC';
</script>

<ul class="collection-cards">
  {#each pages as page}
    <li>
      <CollectionCard {page} {cms} {tagType} />
    </li>
  {/each}
</ul>

<style lang="postcss">
  .collection-cards {
    padding: 0;
    margin: 0;
    list-style-type: none;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }
</style>
