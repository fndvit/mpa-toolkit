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
  import LifeCycle from "$lib/components/LifeCycle/LifeCycle.svelte";
  import MadLib from "$lib/components/MadLib.svelte";
  import { createSections, staticUrl } from "$lib/helpers";
  import Section from "$lib/components/content/Section.svelte";
  import type { ContentDocument, CompletePage, CardsBlock, TagsOnPages, Tag, PageTag } from "$lib/types";
  import UserImage from "$lib/components/content/UserImage.svelte";
  import TinyCarousel from "$lib/components/TinyCarousel/TinyCarousel.svelte";

  export let page: CompletePage;
  export let document: ContentDocument;
  export let headings: { text: string }[];
  export let readTime: number;
  export let recommendedPages: (CompletePage & {tags: PageTag[]})[];
  const MOBILE_VIEW_START_WIDTH = 1120;

  let alsoLikePages = recommendedPages.map(p => ({
    previewImage: p.img,
    title: p.title,
    slug: p.slug,
    tags: p.tags
  }))

  alsoLikePages = alsoLikePages.sort((a,b) => {
    let aTags = 0;
    a.tags.forEach(tag => {
      if(page.tags.find(ct => ct.tag.id === tag.tag.id)) aTags += 1;
    });
    let bTags = 0;
    b.tags.forEach(tag => {
      if(page.tags.find(ct => ct.tag.id === tag.tag.id)) aTags += 1;
    });
    if(aTags > bTags) return -1;
    else if (aTags < bTags) return 1;
    else return 0;
  }).slice(0, 8).map(p => {
    let ret = {...p};
    ret.tags = ret.tags.filter(t => t.tag.type === 'STAGE');
    return ret;
  });

  const sections = createSections(document);

  const components = {
    'heading': Heading,
    'paragraph': Paragraph,
    'cards' : TextSlider,
    'image': Image,
  };

  const keyTakeawaysBlock: CardsBlock = {
    type: 'cards',
    content: page?.chapter?.keyTakeaways.map(k => ({
      type: 'card',
      content: [
        {
          type: 'cardheading',
          content: [{ text: 'Key takeaways', type: 'text'}]
        },
        {
          type: 'cardbody',
          content: [{ text: k, type: 'text'}]
        }
      ]
    }))
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

        <div class="author-images">
          {#each page.chapter.authors as user}
            <UserImage {user} />
          {/each}
        </div>

        <div class="author-names">
          {#each page.chapter.authors as author}
            <div>{author.name}</div>
          {/each}
        </div>

        <div class="readtime">{readTime} min read</div>

      </div>

      <div class="summary">{page.chapter.summary}</div>
      {#if page.chapter.keyTakeaways.length > 0}
        <div class="key-takeaways">
          <TextSlider block={keyTakeawaysBlock}/>
        </div>
      {/if}
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
        {#if sections.length > 1 && i === 2}
          <TinyCarousel slides={alsoLikePages} title={'<b>You may also like</b>'}/>
        {/if}
      {/each}
    </div>
    <div class="lifecycle-column">
      <LifeCycle tags={page.tags}/>
    </div>
  </div>
</div>

<style lang="scss">

  .key-takeaways{
    max-width: 850px;
    margin-bottom: 25px;
    margin-left: -30px;
  }

  .first-line {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    column-gap: 10px;
  }

  .author-images {
    margin-right: 15px;
  }

  .author-names {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
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
    padding-left: 124px;
    h1 {
      max-width: 800px;
      color: white;
      text-shadow: 0px 2px 12px rgba(0, 0, 0, 0.45);
    }
  }

  .unep-logo {
    position: absolute;
    margin: 2rem;
  }

  .meta {
    background: #096EAE;
    color: #F9F9F9;
    padding: 2rem 124px;
  }


  .summary {
    font-family: var(--font-serif);
    font-size: 28px;
    line-height: 42px;
    max-width: 800px;
    margin-bottom: 40px;
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