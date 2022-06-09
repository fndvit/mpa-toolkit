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
    <div class="sliding-menu">
      <svg class="arrow-svg" viewBox="0 0 12 20">
        <path class="arrow-path" d="M1.1814 19L9.81849 10L1.1814 1" />
      </svg>
    </div>
    <div class="sidebarMenu">
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

<style lang="scss">

  .page-content {
    position: relative;
    display: grid;
    grid-template-columns: minmax(250px, 300px) minmax(30rem, 50rem) minmax(300px, auto);
    grid-template-areas: "left-margin body right-margin";
    grid-auto-flow: row;
    column-gap: 1.5rem;
    padding: 0 20px;
  }

  .body-column {
    display: contents;
    font-family: var(--font-serif);
    font-size: 18px;
    line-height: 32px;
    > :global(*) {
      grid-column-start: body;
    }
  }

  .unknown-block {
    background: color(error-red);
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem -1rem;
  }

  .menu {
    grid-area: left-margin;
    top: 10px;
    padding-right: 1rem;
    :global(.mainnav) {
      position: sticky;
      float: right;
      top: 10px;
      flex: 0;
    }
  }

  .lifecycle-container {
    grid-area: right-margin;

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
      margin-right: -20px;
      grid-column: body / right-margin;
  }


  .sliding-menu {
    display: none;
  }

  .arrow-svg {
    width: 12px;
    height: 20px;
    fill: none;
    transform: translateX(8px) translateY(10px);
  }

  .arrow-path {
    stroke:color(neutral-black) ;
    stroke-width: 2.4px;
  }

  @media screen and (max-width: 1250px) {

    .sliding-menu {
      display: flex;
      padding: 1rem;
      margin-top: 2rem;
      background: color(neutral-bg);
      width: 20px;
      height: 40px;
      z-index: 10;
      box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);
      border-radius: 0px 20px 20px 0px;
      position: sticky;
      transform: translateX(-2rem);
      transition: .4s ease-out;

      .menu:hover & {
        box-shadow: 0px 0px 10px #000000;
        opacity: 0;
      }
      
    }

    .sidebarMenu {
      transform: translateX(-4rem) translateY(-6rem);
      width: 220px;
      padding: 1rem 1.5rem;
      box-sizing: border-box;
      transition: .4s ease-out;
    
      .menu:not(:hover) & {
        opacity: 0;
        pointer-events: none;
      }
    }

    .page-content {
      grid-template-columns: auto;
      display: block;
    }
    .body-column {
      :global(.content-carousel) {
        width: auto;
      }
      > :global(.content-section) {
        max-width: 700px;
        margin: auto;
      }
    }
  }

  @media screen and (max-width: 840px) {

    .madlib-container {
      margin-top: 1rem;
      margin-right: 0;
    }

    .body-column {
      font-size: 16px;
      line-height: 28px;
      > :global(.content-section) {
        max-width: 480px;
        margin: auto;
      }

      :global(img) {
        max-width: 100%;
      }
    }
  }

</style>