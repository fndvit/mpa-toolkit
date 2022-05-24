<script lang='ts'>
  import type { SubTypes } from "$lib/types";
  import CollectionPage from "$lib/components/pages/CollectionPage.svelte";
  import CollectionPageHeader from "$lib/components/CollectionPageHeader.svelte";

  export let pages: SubTypes.CollectionCard[];
</script>

<CollectionPageHeader/>
<CollectionPage {pages}/>