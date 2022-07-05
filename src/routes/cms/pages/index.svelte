<script lang="ts">
  import type { SubTypes, Tag } from '$lib/types';
  import CollectionCards from "$lib/components/CollectionCards.svelte";
  import { groupBy } from "$lib/helpers/utils";
  import Searchbar from "$lib/components/generic/Searchbar.svelte";
  import Filters from "$lib/components/Filters.svelte"; 
  import InlineSvg from "$lib/components/generic/InlineSvg.svelte";
  
  export let allTags: Tag[] = null;
  export let pages: SubTypes.Page.CollectionCard[];

  let activeTags: SubTypes.Tag[] = [];
  let orderby = new Array(3);
  let pageSearch = '';

  $: searchRegex = new RegExp(pageSearch, 'i');
  $: filteredPagesSearch = pages.filter(p => searchRegex.test(p.title));

  $: filteredPages = filteredPagesSearch.filter(p => activeTags.every(tag => p.tags.find(pageTag => pageTag.tag.id === tag.id)));

  $: {
    if(!orderby.find(() => true)) {
      filteredPages = filteredPagesSearch.filter(p => activeTags.every(tag => p.tags.find(pageTag => pageTag.tag.id === tag.id)));
    }
    if(orderby[0] || orderby[1]) {
      filteredPages = filteredPages.filter(p => p.chapter != null );

      if(orderby[0])
        filteredPages = filteredPages.sort((a, b) => {
            return (a.chapter.authors[0].name >  b.chapter.authors[0].name ? 1 : ( a.chapter.authors[0].name ===  b.chapter.authors[0].name ? 0 : -1)) }
        );
    }    
    if(orderby[2]) filteredPages = filteredPages.filter(p => p.caseStudy != null );
    
  }

  const groupedOptions = groupBy(allTags, tag => tag.type);
  $: grouped = groupBy(filteredPages, p => p.draft ? 'draft' : 'live');

</script>

<div class="container">
  <div class="title">

    <a href="/cms">
      <InlineSvg svg="BackButton"/>
    </a>
    <h2>Pages</h2>

    <div class="grid-links">
      <a href="/cms/pages/create/chapter">
        <div class="cms-links">
          <div class="icon">
            <InlineSvg svg="BookIcon"/>
          </div>
          <p>CHAPTER</p>
        </div></a>
  
      <a href="/cms/pages/create/case-study">
        <div class="cms-links">
          <div class="icon">
            <InlineSvg svg="UbicationIcon"/>
          </div>
          <p>CASE STUDY</p>
        </div></a>
    </div>
  </div>

  <div class="searchbar">
    <Searchbar
        bind:search={pageSearch}
        type="top"
        placeholder={"Search a Page..."}
        submit={null}
        />
  </div>

  <div class="filters">
    <Filters tags={groupedOptions} bind:activeTags bind:orderby/>
  </div>

  <div class="pages">
    <h4>Draft</h4>
    {#if grouped.draft}
      <CollectionCards pages={grouped.draft} cms />
    {:else}
      No draft pages
    {/if}
  </div>
  <div class="pages">
    <h4>Live</h4>
    {#if grouped.live}
      <CollectionCards pages={grouped.live} cms />
      {:else}
        No live pages
    {/if}
  </div>
</div>

<style lang="stylus">
 
  .container {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    margin: 0px auto;
    typography: ui;

    h2 {
      typography: h2-responsive;
    }

    h4 {
      typography: h4-light;
    }
  }

  .title {
    display: flex;
    align-items: center;
    column-gap: 30px;
    margin-bottom: 20px;
    --ib-hover-border: 1px solid #ddd;
    > h1 {
      margin: 0 10px 15px 0;
    }

    .arrow-back {
      width: 10px;
      fill: none;
      transform: rotate(180deg);
      path {
        stroke: $colors.neutral-black ;
        stroke-width: 2.4px;
      }
    }

    .grid-links {

      display: grid;
      grid-template-columns: auto auto auto;
      grid-gap: 24px;
      text-align: center;
      position: absolute;
      right: 20px;
      margin-top: 80px;

      p {
        margin: 0;
        typography: h4-light;
        color: black;
      }

      a {
        text-decoration: none;
      }
    }

    .cms-links {
      background: white;
      border-radius: 24px;
      box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1); 
      width: 185px;
      height: 140px;

      &:hover{
        background: $colors.neutral-light;
      }

      .icon {
        padding-top: 20px;
        transform: scale(0.85);
      }
    }
  }

  .searchbar {
    max-width: 530px;
    margin-top: 100px;

    :global(.searchbar){
      :global(.placeholder){
        color: $colors.neutral-black;
      }
      :global(.input-text){
        color: $colors.neutral-black;
      }
    }
  }

</style>