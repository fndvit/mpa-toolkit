<script lang="ts">
  import type { SubTypes, Tag } from '$lib/types';
  import CollectionCards from "$lib/components/CollectionCards.svelte";
  import { groupBy } from "$lib/helpers/utils";
  import Searchbar from "$lib/components/generic/Searchbar.svelte";
  import Filters from "$lib/components/Filters.svelte"; 
  
  export let allTags: Tag[] = null;
  export let pages: SubTypes.Page.CollectionCard[];

  let activeTags: SubTypes.Tag[] = [];
  let orderby = new Array(3);

  $: filteredPages = pages.filter(p => activeTags.every(tag => p.tags.find(pageTag => pageTag.tag.id === tag.id)));
  
  $: {
    if(!orderby.find(() => true)) {
      filteredPages = pages.filter(p => activeTags.every(tag => p.tags.find(pageTag => pageTag.tag.id === tag.id)));
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
      <svg class="arrow-back" viewBox="0 0 12 20">
        <path d="M1.1814 19L9.81849 10L1.1814 1" />
      </svg>
    </a>
    <h2>Pages</h2>

    <div class="grid-links">
      <a href="/cms/pages/create/chapter">
        <div class="cms-links">
          <div>
            <svg width="77" height="75">
              <path d="M 4.8125 13.6097 C 9.07156 11.8291 15.1786 9.90893 21.1173 9.31218 C 27.5179 8.6673 32.9464 9.61537 36.0938 12.9312 V 59.8338 C 31.5941 57.2832 25.8913 56.9319 20.6312 57.4612 C 14.9524 58.0387 9.22556 59.6798 4.8125 61.3642 V 13.6097 Z M 40.9062 12.9312 C 44.0536 9.61537 49.4821 8.6673 55.8828 9.31218 C 61.8214 9.90893 67.9284 11.8291 72.1875 13.6097 V 61.3642 C 67.7696 59.6798 62.0476 58.0339 56.3688 57.4661 C 51.1039 56.9319 45.4059 57.2784 40.9062 59.8338 V 12.9312 Z M 38.5 8.58068 C 33.7597 4.50449 26.8874 3.89812 20.6312 4.52374 C 13.3451 5.26005 5.99156 7.75774 1.41006 9.84155 C 0.989686 10.0327 0.633206 10.3409 0.383176 10.7291 C 0.133146 11.1174 0.000127875 11.5694 0 12.0312 L 0 64.9687 C 0.000111467 65.3713 0.101241 65.7675 0.294126 66.1209 C 0.487011 66.4743 0.765485 66.7736 1.10404 66.9915 C 1.44259 67.2094 1.83041 67.3388 2.23196 67.368 C 2.63351 67.3972 3.03595 67.3251 3.40244 67.1584 C 7.64706 65.2334 14.4856 62.9186 21.1124 62.2497 C 27.8933 61.5663 33.5768 62.6684 36.6231 66.4702 C 36.8486 66.7513 37.1343 66.9781 37.4591 67.1339 C 37.784 67.2898 38.1397 67.3707 38.5 67.3707 C 38.8603 67.3707 39.216 67.2898 39.5409 67.1339 C 39.8657 66.9781 40.1514 66.7513 40.3769 66.4702 C 43.4232 62.6684 49.1068 61.5663 55.8828 62.2497 C 62.5144 62.9186 69.3577 65.2334 73.5976 67.1584 C 73.9641 67.3251 74.3665 67.3972 74.768 67.368 C 75.1696 67.3388 75.5574 67.2094 75.896 66.9915 C 76.2345 66.7736 76.513 66.4743 76.7059 66.1209 C 76.8988 65.7675 76.9999 65.3713 77 64.9687 V 12.0312 C 76.9999 11.5694 76.8669 11.1174 76.6168 10.7291 C 76.3668 10.3409 76.0103 10.0327 75.5899 9.84155 C 71.0084 7.75774 63.6549 5.26005 56.3688 4.52374 C 50.1126 3.8933 43.2403 4.50449 38.5 8.58068 Z" stroke-width="1.5"/>
            </svg>
          </div>
          <p>CHAPTER</p>
        </div></a>
  
      <a href="/cms/pages/create/case-study">
        <div class="cms-links">
          <div>
            <svg width="75" height="75">
              <path d="M 58.5489 43.0237 C 56.0271 48.1346 52.6103 53.2262 49.1164 57.7981 C 45.802 62.1083 42.2581 66.237 38.5 70.1663 C 34.7418 66.237 31.1979 62.1083 27.8836 57.7981 C 24.3898 53.2262 20.9729 48.1346 18.4511 43.0237 C 15.9005 37.8599 14.4375 33.0234 14.4375 28.875 C 14.4375 22.4932 16.9726 16.3728 21.4852 11.8602 C 25.9978 7.34765 32.1182 4.8125 38.5 4.8125 C 44.8818 4.8125 51.0022 7.34765 55.5148 11.8602 C 60.0274 16.3728 62.5625 22.4932 62.5625 28.875 C 62.5625 33.0234 61.0947 37.8599 58.5489 43.0237 Z M 38.5 77 C 38.5 77 67.375 49.6361 67.375 28.875 C 67.375 21.2169 64.3328 13.8724 58.9177 8.45729 C 53.5026 3.04218 46.1581 0 38.5 0 C 30.8419 0 23.4974 3.04218 18.0823 8.45729 C 12.6672 13.8724 9.625 21.2169 9.625 28.875 C 9.625 49.6361 38.5 77 38.5 77 Z" stroke-width="1.5"/>
              <path d="M 38.5 38.5 C 35.9473 38.5 33.4991 37.4859 31.6941 35.6809 C 29.8891 33.8759 28.875 31.4277 28.875 28.875 C 28.875 26.3223 29.8891 23.8741 31.6941 22.0691 C 33.4991 20.2641 35.9473 19.25 38.5 19.25 C 41.0527 19.25 43.5009 20.2641 45.3059 22.0691 C 47.1109 23.8741 48.125 26.3223 48.125 28.875 C 48.125 31.4277 47.1109 33.8759 45.3059 35.6809 C 43.5009 37.4859 41.0527 38.5 38.5 38.5 Z M 38.5 43.3125 C 42.3291 43.3125 46.0013 41.7914 48.7089 39.0839 C 51.4164 36.3763 52.9375 32.7041 52.9375 28.875 C 52.9375 25.0459 51.4164 21.3737 48.7089 18.6661 C 46.0013 15.9586 42.3291 14.4375 38.5 14.4375 C 34.6709 14.4375 30.9987 15.9586 28.2911 18.6661 C 25.5836 21.3737 24.0625 25.0459 24.0625 28.875 C 24.0625 32.7041 25.5836 36.3763 28.2911 39.0839 C 30.9987 41.7914 34.6709 43.3125 38.5 43.3125 Z" stroke-width="1.5"/>
            </svg>
          </div>
          <p>CASE STUDY</p>
        </div></a>
    </div>
  </div>

  <div class="searchbar">
    <Searchbar type={'inline'}/>
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

      svg {
        margin-top: 20px;
        transform: scale(0.85);
      }
    }
  }

  .searchbar {
    max-width: 530px;
    margin-top: 100px;

    :global(.placeholder) {
      display: none !important;
    }
  }

</style>