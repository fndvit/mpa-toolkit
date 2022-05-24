<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import CaseStudyMeta from "$lib/components/head/CaseStudyMeta.svelte";
  import Splash from "$lib/components/head/Splash.svelte";
  import ChapterMeta from "$lib/components/head/ChapterMeta.svelte";
  import PageContent from "$lib/components/content/PageContent.svelte";
  import { staticUrl } from "$lib/helpers/content";
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';

  export let page: SubTypes.Page.Full;
  export let recommendedPages: SubTypes.Page.ContentCard[];

  $: fallbackImg = page.chapter ? chapterDefaultImage : caseStudyDefaultImage;
</script>

<div>
  <Splash title={page.title} img={staticUrl(page.img, fallbackImg)} />
  {#if page.chapter }
    <ChapterMeta chapter={page.chapter} readTime={page.readTime} />
  {:else if page.caseStudy}
    <CaseStudyMeta caseStudy={page.caseStudy} />
  {/if}

  <PageContent {page} {recommendedPages} />
</div>

<style lang="scss">

</style>