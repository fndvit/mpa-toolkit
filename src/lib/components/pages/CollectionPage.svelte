<script lang="ts">
  import type { SubTypes } from '$lib/types';
  import CollectionCards from '$lib/components/CollectionCards.svelte';
  import CollectionPageHeader from '../CollectionPageHeader.svelte';

  export let pages: SubTypes.Page.CollectionCard[];
  export let title: string;
</script>

<div class="content">
  <CollectionPageHeader {title} />
  <CollectionCards {pages} />
</div>

<style lang="scss">
  .content {
    background: #ffffff;
    padding-top: 20px;
  }
</style>
