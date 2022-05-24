<script lang='ts'>
  import type { SubTypes, Tag } from "$lib/types";
  import CollectionPage from "$lib/components/pages/CollectionPage.svelte";

  export let pages: SubTypes.Page.CollectionCard[];
  export let tag: Tag;
</script>

<CollectionPage {pages} title={tag.value}/>