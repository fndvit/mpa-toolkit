<script lang="ts">
  import type { SubTypes } from '$lib/types';
  import CollectionCards from '$lib/components/CollectionCards.svelte';
  import CollectionPageHeader from '../CollectionPageHeader.svelte';

  export let pages: SubTypes.Page.CollectionCard[];
  export let title: string;
  export let search: string = null;

</script>

<div class="collection-page">
  <CollectionPageHeader {title} {search} />
  <div class="content">
    {#if search && pages.length === 0}
      <h2>No results found</h2>
    {:else}
      <CollectionCards {pages} />
    {/if}
  </div>
</div>

<style lang="scss">

  .collection-page {
    --page-padding: 90px;
    --page-max-content-width: 1450px;
  }
  .content {
    background: #ffffff;
    padding: 30px var(--page-padding);
    max-width: var(--page-max-content-width);
    margin: auto;
  }
  @media (max-width: 1024px) {
    .collection-page {
      --page-padding: 40px;
    }
  }
  @media (max-width: 768px) {
    .collection-page {
      --page-padding: 20px;
    }
  }
</style>
