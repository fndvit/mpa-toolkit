<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import CaseStudyMeta from "$lib/components/head/CaseStudyMeta.svelte";
  import PageSplash from "$lib/components/head/PageSplash.svelte";
  import ChapterMeta from "$lib/components/head/ChapterMeta.svelte";
  import PageContent from "$lib/components/content/PageContent.svelte";
  import Footer from "$lib/components/Footer.svelte";

  export let page: SubTypes.Page.Full;
  export let recommendedPages: SubTypes.Page.ContentCard[];

</script>

<div class="page-container">
  <PageSplash {page} />
  {#if page.chapter }
    <ChapterMeta chapter={page.chapter} readTime={page.readTime} tags={page.tags} />
  {:else if page.caseStudy}
    <CaseStudyMeta caseStudy={page.caseStudy} />
  {/if}
  <!--<PageContent {page} {recommendedPages} />
  <Footer/>-->
</div>
