<script context="module" lang="ts">
  // export async function load({ params, fetch, stuff }) {
  //   return {
  //     maxage: 3600,
  //     props: {
  //     }
  //   };
  // }
</script>

<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import Page from "$lib/components/pages/Page.svelte";

  export let page: SubTypes.Page;
  export let recommendedPages: SubTypes.ContentCard[];

</script>

<Page {page} {recommendedPages} />
