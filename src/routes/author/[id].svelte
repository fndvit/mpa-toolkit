<script lang='ts'>
  import type { SubTypes } from "$lib/types";
  import CollectionPage from "$lib/components/pages/CollectionPage.svelte";

  export let pages: SubTypes.CollectionCard[];
</script>

<CollectionPage {pages}/>
