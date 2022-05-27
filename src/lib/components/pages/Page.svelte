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
    <ChapterMeta chapter={page.chapter} readTime={page.readTime} />
  {:else if page.caseStudy}
    <CaseStudyMeta caseStudy={page.caseStudy} />
  {/if}

  <PageContent {page} {recommendedPages} />
  <Footer/>
</div>

<style lang="scss">

  .page-container {
    @media screen and (max-width: 840px) {
      --lifecycle-overlap: 190px;

      :global(.meta) {
        padding-bottom: var(--lifecycle-overlap);
      }

      :global(.lifecycle-container) {
        margin-top: calc(-1 * var(--lifecycle-overlap));
      }

      :global(.meta-container:not(.has-milestones)) {
        padding-bottom: var(--lifecycle-overlap);
      }
      :global(.milestones) {
        padding-bottom: var(--lifecycle-overlap);
      }
    }
  }
</style>