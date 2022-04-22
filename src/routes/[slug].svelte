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
  import ExpandButton from "$lib/components/ExpandButton.svelte";

  import { staticUrl } from "$lib/helpers";
  import type { ContentDocument, CompletePage, HeadingBlock } from "$lib/types";
  import { onMount } from "svelte";

  export let page: CompletePage;
  export let document: ContentDocument;
  export let headings: { text: string }[];
  export let readTime: number;

  interface Section {
    beginIndex: number,
    endIndex: number
  }

  onMount(() => {
    preprocessContent();
  });

  let componentsVisibility = [];
  for (let i = 0; i < document.content.length; i++) {
    let v = {type: '', visible: true};
    componentsVisibility[i] = v;
  }

  const preprocessContent = () => {

    addExpandButtons();
    console.log(document.content);
    console.log(componentsVisibility);
  }

  const addExpandButtons = () => {
    let sections:Section[] = getDocumentSections();
    for (let y = sections.length - 1; y >= 0; y--) {
      let buttonPos = isExpandable(sections[y]);
      if (buttonPos !== -1){
        document.content.splice(buttonPos, 0, {type: 'expand', content: {section: "blue economy"}});
        componentsVisibility.splice(buttonPos, 0, {type: 'expand', visible: true});
        let z = buttonPos+1;
        let foundHeader = false;
        while(z < document.content.length && !foundHeader){
          if (document.content[z].type === 'heading'){
            foundHeader = true;
          }
          else {
            componentsVisibility[z] = false;
            z++;
          }
        }
      }
    }
  }



  /*const addExpandSectionButtons = () => {
    componentsVisibility = [];
    let madLibAdded = false;
    for (let i = 0; i < document.content.length; i++) {
      if (document.content[i].type === 'heading'){
        componentsVisibility[i] = {type: document.content[i].type, visible: true};
        let x = i + 1;
        let numParagraphs = 0;
        while (document.content[x].type !== 'heading' && numParagraphs < 2) {
          if (document.content[x].type === 'paragraph'){
            numParagraphs++;
          }
          componentsVisibility[x] = {type: document.content[x].type, visible: true};
          x++;
        }
        if (numParagraphs >= 2){
          document.content.splice(x, 0, {type: 'expand', content: {section: "blue economy"}});
          componentsVisibility[x] = {type: document.content[x].type, visible: true};
          if (!madLibAdded){
            x++;
            document.content.splice(x, 0, {type: 'madlib'});
            componentsVisibility[x] = {type: document.content[x].type, visible: true};
            madLibAdded = true;
          }
        }
        i = x;
      }
      else {
        componentsVisibility[i] = {type: document.content[i].type, visible: false};
      }
    }
  }*/

  function getDocumentSections(): Section[] {
    let sections: Section[] = [];
    for (let i = 0; i < document.content.length; i++) {
      if (document.content[i].type === 'heading'){
        let x = i+1;
        let foundHeader = false;
        let beginSectionPos = i;
        let endSectionPos = document.content.length-1;
        while (x < document.content.length && !foundHeader){
          if (document.content[x].type === 'heading') {
            endSectionPos = x-1;
            foundHeader = true;
          }
          x++;
        }
        let newSection: Section = {beginIndex: beginSectionPos, endIndex: endSectionPos};
        sections.push(newSection);
      }
    }
    return sections;
  }

  function isExpandable(section: Section): number {
    let i = section.beginIndex;
    let numParagraphs = 0;
    let lastVisibleParagraphIndex = 0;
    while (i <= section.endIndex){
      if (document.content[i].type === 'paragraph'){
        numParagraphs++;
        if (numParagraphs === 2){
          lastVisibleParagraphIndex = i;
        }
      }
      i++;
    }
    if (numParagraphs > 2){
      return lastVisibleParagraphIndex + 1;
    }
    else{
      return -1;
    }
  }


  const addExpandSectionButtons2 = () => {

  }


  const components = {
    'heading': Heading,
    'paragraph': Paragraph,
    'cards' : TextSlider,
    'image': Image,
    'madlib': MadLib,
    'expand' : ExpandButton
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
      {#if page.chapter.keyTakeaways}
        <div class="key-takeaways">
          <TextSlider block={page.chapter.keyTakeaways}/>
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
      {#each document.content as block, i}
        {#if components[block.type]}
          {#if componentsVisibility[i].visible}
            <svelte:component this={components[block.type]} {block} />
          {/if}
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

  .key-takeaways{
    max-width: 850px;
    margin-bottom: 25px;
    margin-left: -30px;
  }

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
    margin-bottom: 40px;
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