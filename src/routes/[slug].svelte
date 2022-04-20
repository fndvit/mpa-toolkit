<script context="module" lang="ts">
  // export async function load({ params, fetch, stuff }) {
  //   return {
  //     maxage: 3600,
  //     props: {
  //     }
  //   };
  // }
</script>

<script lang="ts">
  import CaseStudyMeta from "$lib/components/content/CaseStudyMeta.svelte";
  import Heading from "$lib/components/content/Heading.svelte";
  import Image from "$lib/components/content/Image.svelte";
  import Paragraph from "$lib/components/content/Paragraph.svelte";
  import StickyMenu from "$lib/components/StickyMenu/StickyMenu.svelte";
  import TextSlider from "$lib/components/TextSlider/TextSlider.svelte";
  import MadLib from "$lib/components/MadLib.svelte";

  import { staticUrl } from "$lib/helpers";
  import type { ContentDocument, CompletePage } from "$lib/types";
  import { beforeUpdate, onMount } from "svelte";

  export let page: CompletePage;
  export let document: ContentDocument;
  export let headings: { text: string }[];
  export let readTime: number;

  beforeUpdate(() => {
    addMadLib();
	});

  const addMadLib = () => {
    document.content.splice(4, 0, {type: 'madlib'});
  }

  const components = {
    'heading': Heading,
    'paragraph': Paragraph,
    'cards' : TextSlider,
    'image': Image,
    'madlib': MadLib
  };

</script>

<div>
  <img class="unep-logo" src="/unep.svg" alt="unep-logo" />
  <div class="splash" style="background-image: url({staticUrl(page.img)});">
    <h1>{page.title}</h1>
  </div>

  {#if page.chapter }

    <div class="meta">
      <div class="first-line">
        <div class="authors">
          {#each page.chapter.authors as author}
            <div>{author.name}</div>
          {/each}
        </div>
        <div class="readtime">{readTime} min read</div>
      </div>
      <div class="summary">{page.chapter.summary}</div>
    </div>

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
      {#each document.content as block}
        {#if components[block.type]}
          <svelte:component this={components[block.type]} {block} />
        {:else}
          {@debug block}
          <div class="unknown-block">
            Unknown block type: {block.type}
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style lang="scss">

  .first-line {
    display: flex;
    margin-bottom: 2rem;
  }

  .body-column {
    font-family: var(--font-serif);
    font-size: 18px;
    line-height: 32px;
  }

  .splash {
    min-height: 60vh;
    display: flex;
    align-items: flex-end;
    padding: 6rem;
    padding-bottom: 3rem;
    h1 {
      max-width: 800px;
      color: white;
    }
  }

  .unep-logo {
    position: absolute;
    margin: 2rem;
  }

  .meta {
    background: #096EAE;
    color: #F9F9F9;
    padding: 2rem 6rem;
  }

  .authors {
    display: inline-block;
    font-weight: bold;
    font-size: 16px;
    margin-right: 10px;
  }

  .summary {
    font-family: var(--font-serif);
    font-size: 28px;
    line-height: 42px;
    max-width: 800px;
  }

  .content {
    padding: 2rem 6rem;
    display: grid;
    grid-template-columns: 15rem 40rem;
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