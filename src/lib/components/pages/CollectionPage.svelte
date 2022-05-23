<script lang="ts">
  import type { SubTypes } from '$lib/types';
  import CollectionCards from '$lib/components/CollectionCards.svelte';

  export let pages: SubTypes.Page.CollectionCard[];
</script>

<div class="content">
  <CollectionCards {pages} />
</div>

<style lang="scss">
  .content {
    background: #ffffff;
    padding: 20px;
  }
</style>
