<script lang="ts">
  import type { Page } from '@mpa/db';
  import PageSplash from './shared/PageSplash.svelte';
  import ChapterHead from './chapter/ChapterHead.svelte';
  import CaseStudyHead from './casestudy/CaseStudyHead.svelte';
  import PageContent from './body/PageContent.svelte';
  import { getPageTypeStr } from '$lib/helpers/content';
  import { Footer } from '$lib/components/shared';

  export let page: Page;
</script>

<div class="page page-static" data-pagetype={getPageTypeStr(page)}>
  <PageSplash {page} />
  {#if page.chapter}
    <ChapterHead chapter={page.chapter} readTime={page.readTime} tags={page.tags} />
  {:else if page.caseStudy}
    <CaseStudyHead caseStudy={page.caseStudy} tags={page.tags} />
  {/if}
  <PageContent {page} />
  <Footer />
</div>
