<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import StickyMenu from "../StickyMenu/StickyMenu.svelte";
  import Section from "./Section.svelte";
  import { createSections } from "$lib/helpers/content";
  import Heading from "./Heading.svelte";
  import Paragraph from "./Paragraph.svelte";
  import TextSlider from "./TextSlider.svelte";
  import ContentMadLib from "$lib/components/Madlib/ContentMadLib.svelte";
  import ContentCarousel from "$lib/components/content/ContentCarousel.svelte";
  import Image from "./Image.svelte";
  import LifeCycle from "../LifeCycle.svelte";

  export let page: SubTypes.Page.Full;
  export let recommendedPages: SubTypes.Page.ContentCard[] = null;

  const sections = createSections(page.content);

  const components = {
    'heading': Heading,
    'paragraph': Paragraph,
    'cards' : TextSlider,
    'image': Image,
  };

  const headings = sections.filter(s => s.id);

</script>

<div class="page-content">

  <div class="menu">
    <StickyMenu menuOptions={headings} />
  </div>
  {#if page.caseStudy }
    <div class="lifecycle-container">
      <LifeCycle tags={page.tags}/>
    </div>
  {/if}
  <div class="body-column">
    {#each sections as section, i}
      <Section {section}>
        {#each section.blocks as block}
          {#if components[block.type]}
            <svelte:component this={components[block.type]} {block} />
          {:else}
            <div class="unknown-block">
              Unknown block type: {block.type}
            </div>
          {/if}
        {/each}
      </Section>

      {#if sections.length > 1 }
        {#if i === 0}
          <div class="madlib-container">
            <ContentMadLib />
          </div>
        {:else if i === 2 && recommendedPages?.length > 0}
          <div class="content-carousel-container">
            <ContentCarousel slides={recommendedPages} title={'You may also like'}/>
          </div>
        {/if}
      {/if}
      {/each}
    </div>
</div>

<style lang="stylus">

  .page-content {
    grid-config(page, content);

    position: relative;
    min-height: 800px // so empty pages don't collapse
    grid-auto-rows: min-content;
    padding-bottom: 2rem;
  }

  .body-column {
    display: contents;
    font-family: var(--font-serif);
    font-size: 18px;
    line-height: 32px;
    > :global(*) {
      grid-column: body;
    }
  }

  .unknown-block {
    background: $colors.error-red;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem -1rem;
  }

  .menu {
    grid-column: menu;
    grid-row: 1 / span 100; // can't span -1 through dynamic rows
    margin: 0 1rem 0 -30px;
    :global(.sticky-menu) {
      position: sticky;
      top: 0;
      flex: 0;
    }

    +breakpoint(page, medium) {
      margin: 0 1rem 0 0;
      display: none;
    }

    +breakpoint(page, small) {
      display: none;
    }
  }

  .lifecycle-container {
    grid-area: lifecycle;
    padding-top: 1.5rem;
    :global(.lifecycle) {
      margin: auto;
      max-width: 300px;
    }
    transform: translate(0%, -19.5rem);
  }

  .content-carousel-container {
    overflow: hidden;
  }

  .madlib-container,
  .content-carousel-container {
    margin-left: -25px;
    grid-column: body / -1;
  }

</style>