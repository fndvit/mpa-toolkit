<script lang='ts'>
  import type { SubTypes } from "$lib/types";
  import CollectionPages from "$lib/components/CollectionPages/CollectionPages.svelte";

  export let pages: SubTypes.CollectionCard[];
</script>

<CollectionPages {pages}/>