<script lang="ts">
  import type { Page } from '@mpa/db';
  import ContentMadLib from '../shared/ContentMadLib.svelte';
  import StickyMenu from './StickyMenu.svelte';
  import Section from './Section.svelte';
  import Block from './Block.svelte';
  import ContentCarousel from './ContentCarousel.svelte';
  import { createSections, getSectionSize } from '$lib/helpers/content';

  export let page: Page;

  const sections = createSections(page.content);

  const headings = sections.filter(s => s.id);

  const MIN_SIZE_FOR_MADLIB = 475;

  let cumulativeBlockLength = 0;

  const madlibIndex = sections.findIndex(section => {
    cumulativeBlockLength += getSectionSize(section);
    return cumulativeBlockLength >= MIN_SIZE_FOR_MADLIB;
  });
</script>

<div class="page-content">
  <div class="menu-container">
    <div class="menu">
      <StickyMenu menuOptions={headings} />
      <div class="sliding-arrow">
        <svg viewBox="0 0 12 20">
          <path d="M1.1814 19L9.81849 10L1.1814 1" />
        </svg>
      </div>
    </div>
  </div>
  <div class="body-column">
    {#each sections as section, i}
      <Section {section}>
        {#each section.blocks as block}
          <Block {block} />
        {/each}
      </Section>

      {#if sections.length > 1}
        {#if i === madlibIndex}
          <div class="madlib-container">
            <ContentMadLib />
          </div>
        {:else if i === 2}
          <div class="content-carousel-container">
            <ContentCarousel title={'You may also like'} recommendationType={page.chapter ? 'chapter' : 'case-study'} />
          </div>
        {/if}
      {/if}
    {/each}
    <div class="content-carousel-container">
      <ContentCarousel
        title={'What to read next'}
        referencePage={page}
        recommendationType={page.chapter ? 'chapter' : 'case-study'}
      />
    </div>
  </div>
</div>

<style lang="postcss">
  .page-content {
    @mixin grid-config content, content;

    position: relative;
    min-height: 800px;
    grid-auto-rows: min-content;
    padding-bottom: 2rem;
  }

  .body-column {
    display: contents;

    > :global(*) {
      grid-column: body;
    }
  }

  .menu-container {
    grid-column: menu;
    grid-row: menu / span 100;
    margin: 0 1rem 0 -30px;
    z-index: $z-sticky-menu;

    @mixin breakpoint content, medium {
      margin: 0 1rem 0 0;
    }
  }

  .menu {
    position: sticky;
    top: 0;
    flex: 0;

    @mixin breakpoint content, medium {
      margin-top: 5px;
      width: fit-content;
      transform: translateX(-100%);
      transition: transform 0.5s ease-out;
      pointer-events: none;

      :global(.sticky-menu) {
        position: relative;
        z-index: 2;
        width: 220px;
        border-radius: 0 20px 20px 0;
      }

      .menu-container:hover & {
        transform: translateX(0);
        pointer-events: all;

        .sliding-arrow {
          transform: translateX(-100%);
        }
      }
    }
  }

  .sliding-arrow {
    display: none;
    cursor: pointer;
    position: absolute;
    z-index: 1;
    width: 30px;
    left: 100%;
    top: 30px;
    bottom: 30px;
    max-height: 80px;
    transform-origin: 0% 0%;
    background: color($c-neutral-dark alpha(0.2));
    box-shadow: 0 1px 16px rgb(0 0 0 / 10%);
    border-radius: 0 10px 10px 0;
    transition: transform 0.1s ease-out;

    svg {
      width: 10px;
      fill: none;
      margin: auto;

      path {
        stroke: $c-neutral-black;
        stroke-width: 2.4px;
      }
    }

    @mixin breakpoint content, medium {
      display: flex;
    }

    @mixin breakpoint content, small {
      width: 18px;

      svg {
        width: 6px;
      }
    }
  }

  .content-carousel-container {
    overflow: hidden;
  }

  .madlib-container,
  .content-carousel-container {
    margin: 25px 0px 25px -25px;
    grid-column: body / -1;
  }
</style>
