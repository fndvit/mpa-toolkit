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
  import type { CompletePage } from "$lib/types";
  import Page from "$lib/components/content/Page.svelte";
  import type { ContentCard } from "$lib/components/TinyCarousel/TinyCarousel.svelte";

  export let page: CompletePage;
  export let readTime: number;
  export let recommendedPages: ContentCard[];

</script>

<Page {page} {recommendedPages} {readTime} />