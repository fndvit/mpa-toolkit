<script lang="ts">
  import { groupBy } from '@mpa/utils';
  import type { PageData } from './$types';
  import PageListFilters from '$lib/components/cms/PageListFilters.svelte';
  import CollectionCards from '$lib/components/collection/CollectionCards.svelte';
  import { ky } from '$lib/api';

  export let data: PageData;

  $: allTags = data.allTags;
  $: pages = data.pages;

  let activeTags: typeof allTags = [];
  let searchFilterPageIds: Set<number>;

  const onSearch = async (text: string) => {
    if (text) {
      const result = await ky.get('search', { searchParams: { q: text } });
      const data = await result.json<{ pages: number[] }>();
      searchFilterPageIds = new Set(data.pages);
    } else {
      searchFilterPageIds = undefined;
    }
  };

  $: filteredPages = pages
    .filter(p => (searchFilterPageIds ? searchFilterPageIds.has(p.id) : true))
    .filter(p => activeTags.every(tag => p.tags.find(pageTag => pageTag.tag.id === tag.id)));

  $: grouped = groupBy(filteredPages, p => (p.draft ? 'draft' : 'live'));
</script>

<div class="container">
  <div class="title">
    <a href="/cms">
      <span class="material-icons">navigate_before</span>
    </a>
    <h2>Pages</h2>

    <div class="grid-links">
      <a href="/cms/pages/create/chapter">
        <div class="cms-links">
          <span class="material-icons icon-links">auto_stories</span>
          <p>CHAPTER</p>
        </div></a
      >

      <a href="/cms/pages/create/case-study">
        <div class="cms-links">
          <span class="material-icons icon-links">location_on</span>
          <p>CASE STUDY</p>
        </div></a
      >
    </div>
  </div>

  <div class="filters">
    <PageListFilters tags={allTags} bind:activeTags on:search={e => onSearch(e.detail)} />
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

<style lang="postcss">
  .container {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    margin: 0 auto;
    font: $f-ui;

    h2 {
      @mixin font-responsive h2;
    }

    h4 {
      font: $f-h4-light;
    }
  }

  .title {
    display: flex;
    align-items: center;
    column-gap: 30px;
    margin-bottom: 20px;

    --ib-hover-border: 1px solid #ddd;

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
        font: $f-h4-light;
        color: black;
      }

      a {
        text-decoration: none;
      }
    }

    .material-icons {
      color: black;
      font-size: 32px;
    }

    .cms-links {
      background: white;
      border-radius: 24px;
      box-shadow: 0 1px 16px rgb(0 0 0 / 10%);
      width: 185px;
      height: 140px;

      &:hover {
        background: $c-neutral-light;
      }

      .icon-links {
        padding: 20px 0 10px;
        font-size: 68px;
      }
    }
  }
</style>
