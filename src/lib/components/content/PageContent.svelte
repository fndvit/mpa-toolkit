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
    <div class="sliding-arrow">
      <svg class="arrow-svg" viewBox="0 0 12 20">
        <path class="arrow-path" d="M1.1814 19L9.81849 10L1.1814 1" />
      </svg>
    </div>
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
    z-index: 1;

    :global(.sticky-menu) {
      position: sticky;
      top: 0;
      flex: 0;
    }

    +breakpoint(page, medium) {
      margin: 0 1rem 0 0;
      grid-column: paddingl;

      &:hover {
        & .sliding-arrow {
          box-shadow: 0px 0px 10px #000000;
          opacity: 0;
        }

        & :global(.sticky-menu){
          display: block;
          transform: translate(0, -50%);
          pointer-events: auto;
        }
      }

      :global(.sticky-menu) {
        width: 220px;
        border-radius: 0px 20px 20px 0px;
        position: sticky;
        top: 50%;
        transform: translate(-100%, -50%);
        transition: .5s ease-out;  
        -webkit-transition: .5s ease-in-out;
        -moz-transition: .5s ease-in-out;
        -o-transition: .5s ease-in-out;
        pointer-events: none;   
      }
    }
  }

  .sliding-arrow {
    display: none;
    cursor: pointer;
    
    +breakpoint(page, medium) {

      display: flex;
      padding: 0.8rem;
      background: alpha($colors.neutral-dark, 0.2);
      width: 10px;
      height: 25px;
      box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);
      border-radius: 0px 10px 10px 0px;
      transition: .4s ease-out;
      position: sticky;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      
    }

    +breakpoint(page, small) {
      padding: 0.25rem;
    }
  }

  .arrow-svg {
    width: 10px;
    height: 14px;
    fill: none;
    z-index: 10;
    align-self: center;
  }
  
  .arrow-path {
    stroke: $colors.neutral-black ;
    stroke-width: 2.4px;
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