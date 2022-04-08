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
  import Heading from "$lib/components/content/Heading.svelte";
  import Paragraph from "$lib/components/content/Paragraph.svelte";
  import StickyMenu from "$lib/components/StickyMenu/StickyMenu.svelte";
  import TextSlider from "$lib/components/TextSlider/TextSlider.svelte";

  import { staticUrl } from "$lib/helpers";
  import type { ContentDocument, CompletePage } from "$lib/types";

  export let page: CompletePage;
  export let document: ContentDocument;
  export let headings: { text: string }[];

  const components = {
    'heading': Heading,
    'paragraph': Paragraph,
    'cards' : TextSlider
  }
</script>

<div>
  <img class="unep-logo" src="/unep.svg" alt="unep-logo" />
  <div class="splash" style="background-image: url({staticUrl(page.img)});">
    <h1>{page.title}</h1>
  </div>

  <div class="meta">
    <div class="authors">
      {#each page.chapter.authors as author}
        <div>{author.name}</div>
      {/each}
    </div>
    <div class="summary">{page.chapter.summary}</div>
  </div>
  <div class="content">
    <div class="menu-column">
      <div class="menu">
        <StickyMenu
          menuOptions = {headings}
        />
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
    color: white;
    padding: 2rem 6rem;
  }

  .authors {
    margin-bottom: 2rem;
  }

  .summary {
    font-family: var(--font-serif);
    font-size: 1.8rem;
    line-height: 1.5;
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

  /*------------------------------------------*/


  :global(sup) {
      font-size: 0.6em;
      vertical-align: top;
      position: relative;
      top: -0.5em;
    }

  .information-container {
    position: relative;
    padding-top: 35px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
    background: #311E5D;
    width: 100%;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.2);
  }

  .grid-container-first {
    display: grid;
    grid-template-columns: 325px 225px 425px 325px; /* This has to sum a total of 1.300px*/
    padding-left: 100px;
    padding-right: 100px;
  }

  .grid-item-first {
    text-align: left;
    padding: 20px;
  }

  .grid-container-second {
    display: grid;
    grid-template-columns: 325px 325px 325px 325px;
    padding-left: 100px;
    padding-right: 100px;
  }

  .grid-item-second {
    text-align: left;
    padding: 20px;
  }

  .globe {
    transform: translate(975px, -122.5px);
    position: absolute;
  }

  .property-value-first {
    font-family: 'Bitter';
    font-size: 28px;
    line-height: 42px;
    color: white;
  }

  .property-value-second {
    font-family: 'Bitter';
    font-size: 18px;
    line-height: 32px;
    color: white;
  }

  .property-name {
    font-family: 'Montserrat';
    font-weight: bold;
    color: #F1C0B5;
    font-size: 16px;
    line-height: 24px;
  }


  .menu {
    position: sticky;
    top: 10px;
  }
</style>