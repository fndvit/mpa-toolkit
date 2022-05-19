<script lang="ts">
  import type { CompletePage } from '$lib/types';
  import CollectionCard from './CollectionCard.svelte';

  export let pages: (CompletePage & {readTime: number})[];
</script>

<div class="content">
  <ul class="page-list">
    {#each pages as page}
      <li>
        <CollectionCard {page} />
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .page-list {
    list-style-type: none;
  }
</style>
