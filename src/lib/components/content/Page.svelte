<script lang="ts">
  import CaseStudyMeta from "$lib/components/content/CaseStudyMeta.svelte";
  import Splash from "$lib/components/content/Splash.svelte";
  import type { CompletePage } from "$lib/types";
  import type { ContentCard } from "$lib/components/TinyCarousel/TinyCarousel.svelte";
  import ChapterMeta from "$lib/components/content/ChapterMeta.svelte";
  import PageContent from "./PageContent.svelte";

  export let page: CompletePage;
  export let readTime: number;
  export let recommendedPages: ContentCard[];

</script>

<div>
  <Splash title={page.title} img={page.img} />
  {#if page.chapter }
    <ChapterMeta chapter={page.chapter} {readTime} />
  {:else if page.caseStudy}
    <CaseStudyMeta caseStudy={page.caseStudy} />
  {/if}

  <PageContent {page} {recommendedPages} />
</div>

<style lang="scss">

</style>