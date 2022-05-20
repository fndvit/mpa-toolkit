<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import CaseStudyMeta from "$lib/components/content/CaseStudyMeta.svelte";
  import Splash from "$lib/components/content/Splash.svelte";
  import ChapterMeta from "$lib/components/content/ChapterMeta.svelte";
  import PageContent from "./PageContent.svelte";

  export let page: SubTypes.Page;
  export let recommendedPages: SubTypes.ContentCard[];

</script>

<div>
  <Splash title={page.title} img={page.img} />
  {#if page.chapter }
    <ChapterMeta chapter={page.chapter} readTime={page.readTime} />
  {:else if page.caseStudy}
    <CaseStudyMeta caseStudy={page.caseStudy} />
  {/if}

  <PageContent {page} {recommendedPages} />
</div>

<style lang="scss">

</style>