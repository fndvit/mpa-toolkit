<script lang="ts">
  import type { SubTypes } from '$lib/types';
  import CollectionCard from '$lib/components/CollectionCard.svelte';

  export let pages: SubTypes.Page.CollectionCard[];
  export let cms = false;
</script>

<ul class="collection-cards">
  {#each pages as page}
    <li>
      <CollectionCard {page} {cms}/>
    </li>
  {/each}
</ul>

<style lang="stylus">
  .collection-cards {
    padding: 0;
    margin: 0;
    list-style-type: none;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }
</style>
