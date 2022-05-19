<script lang='ts'>
  import CollectionPages from "$lib/components/CollectionPages/CollectionPages.svelte";
  import type { CompletePage } from "$lib/types";

  export let pages: (CompletePage & {readTime: number})[];
</script>

<div class="content">
  <CollectionPages {pages}/>
</div>


<style>
  .content{
    background: #E5E5E5;
  }
</style>