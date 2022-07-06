<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import CaseStudyMeta from "$lib/components/head/CaseStudyMeta.svelte";
  import PageSplash from "$lib/components/head/PageSplash.svelte";
  import ChapterMeta from "$lib/components/head/ChapterMeta.svelte";
  import PageContent from "$lib/components/content/PageContent.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { getPageTypeStr } from "$lib/helpers/content";

  export let page: SubTypes.Page.Full;
  export let recommendedPages: SubTypes.Page.ContentCard[];

</script>

<div class="page page-static" data-pagetype={getPageTypeStr(page)}>
  <PageSplash {page} />
  {#if page.chapter }
    <ChapterMeta chapter={page.chapter} readTime={page.readTime} tags={page.tags} />
  {:else if page.caseStudy}
    <CaseStudyMeta caseStudy={page.caseStudy} tags={page.tags} />
  {/if}
  <PageContent {page} {recommendedPages} />
  <Footer/>
</div>
