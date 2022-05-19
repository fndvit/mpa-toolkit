<script lang="ts">
  import CaseStudyMeta from "$lib/components/content/CaseStudyMeta.svelte";
  import Heading from "$lib/components/content/Heading.svelte";
  import Image from "$lib/components/content/Image.svelte";
  import Splash from "$lib/components/content/Splash.svelte";
  import Paragraph from "$lib/components/content/Paragraph.svelte";
  import StickyMenu from "$lib/components/StickyMenu/StickyMenu.svelte";
  import TextSlider from "$lib/components/content/TextSlider.svelte";
  import LifeCycle from "$lib/components/LifeCycle/LifeCycle.svelte";
  import MadLib from "$lib/components/MadLib.svelte";
  import { createSections } from "$lib/helpers/content";
  import Section from "$lib/components/content/Section.svelte";
  import type { CompletePage } from "$lib/types";
  import TinyCarousel, { type ContentCard } from "$lib/components/TinyCarousel/TinyCarousel.svelte";
  import ChapterMeta from "$lib/components/content/ChapterMeta.svelte";

  export let page: CompletePage;
  export let readTime: number;
  export let recommendedPages: ContentCard[];

  const sections = createSections(page.content);

  const components = {
    'heading': Heading,
    'paragraph': Paragraph,
    'cards' : TextSlider,
    'image': Image,
  };

  const headings = sections.filter(s => s.id);

</script>

<div>

  <Splash title={page.title} img={page.img} />
  {#if page.chapter }
    <ChapterMeta chapter={page.chapter} {readTime} />
  {:else if page.caseStudy}
    <CaseStudyMeta caseStudy={page.caseStudy} />
  {/if}

  <div class="content">
    <div class="menu-column">
      <div class="menu">
        <StickyMenu menuOptions={headings} />
      </div>
    </div>
    <div class="body-column">
      {#each sections as section, i}
        <Section {section}>
          {#each section.blocks as block}
            {#if components[block.type]}
              <svelte:component this={components[block.type]} {block} />
            {:else}
              {@debug block}
              <div class="unknown-block">
                Unknown block type: {block.type}
              </div>
            {/if}
          {/each}
        </Section>
        {#if sections.length > 1 && i === 0}
          <MadLib />
        {/if}
        {#if sections.length > 1 && i === 2 && recommendedPages.length > 0}
          <TinyCarousel slides={recommendedPages} title={'You may also like'}/>
        {/if}
      {/each}
    </div>
    <div class="lifecycle-column">
      <LifeCycle tags={page.tags}/>
    </div>
  </div>
</div>

<style lang="scss">


  .body-column {
    font-family: var(--font-serif);
    font-size: 18px;
    line-height: 32px;
  }

  .content {
    padding: 2rem 6rem;
    display: grid;
    grid-template-columns: 15rem 40rem auto;
    column-gap: 1rem;
    :global(h1) {
      font-size: 2.5rem;
    }
  }

  .unknown-block {
    background: #fca5a5;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem -1rem;
  }

  .menu {
    position: sticky;
    top: 10px;
  }
</style>