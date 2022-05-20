<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import StickyMenu from "../StickyMenu/StickyMenu.svelte";
  import Section from "./Section.svelte";
  import { createSections } from "$lib/helpers/content";
  import Heading from "./Heading.svelte";
  import Paragraph from "./Paragraph.svelte";
  import TextSlider from "./TextSlider.svelte";
  import MadLib from "../MadLib.svelte";
  import TinyCarousel from "$lib/components/TinyCarousel.svelte";
  import LifeCycle from "$lib/components/LifeCycle.svelte";
  import Image from "./Image.svelte";

  export let page: SubTypes.Page;
  export let recommendedPages: SubTypes.ContentCard[] = null;

  const sections = createSections(page.content);

  const components = {
    'heading': Heading,
    'paragraph': Paragraph,
    'cards' : TextSlider,
    'image': Image,
  };

  const headings = sections.filter(s => s.id);

</script>

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
            <div class="unknown-block">
              Unknown block type: {block.type}
            </div>
          {/if}
        {/each}
      </Section>
      {#if sections.length > 1 && i === 0}
        <MadLib />
      {/if}
      {#if sections.length > 1 && i === 2 && recommendedPages?.length > 0}
        <TinyCarousel slides={recommendedPages} title={'You may also like'}/>
      {/if}
    {/each}
  </div>
  <div class="lifecycle-column">
    <LifeCycle tags={page.tags}/>
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