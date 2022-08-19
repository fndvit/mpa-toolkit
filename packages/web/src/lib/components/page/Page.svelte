<script lang="ts">
  import type { Page } from '@mpa/db';
  import { CaseStudyHead, ChapterHead, Footer, PageContent, PageSplash } from '$lib/components';
  import { getPageTypeStr } from '$lib/helpers/content';

  export let page: Page;
  export let recommendedPages: Page.ContentCard[];
</script>

<div class="page page-static" data-pagetype={getPageTypeStr(page)}>
  <PageSplash {page} />
  {#if page.chapter}
    <ChapterHead chapter={page.chapter} readTime={page.readTime} tags={page.tags} />
  {:else if page.caseStudy}
    <CaseStudyHead caseStudy={page.caseStudy} tags={page.tags} />
  {/if}
  <PageContent {page} {recommendedPages} />
  <Footer />
</div>
