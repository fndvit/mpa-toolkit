<script lang='ts'>
  import type { SubTypes } from "$lib/types";
  import CollectionPages from "$lib/components/CollectionPages/CollectionPages.svelte";

  export let pages: SubTypes.CollectionCard[];
</script>

<div class="content">
  <CollectionPages {pages}/>
</div>


<style>
  .content{
    background: #E5E5E5;
  }
</style>