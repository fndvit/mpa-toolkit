<script lang="ts">
  import type { Page, TagType } from '@mpa/db';
  import CollectionPageHeader from './CollectionPageHeader.svelte';
  import CollectionCards from './CollectionCards.svelte';

  export let pages: Page.CollectionCard[];
  export let title: string;
  export let bio: string = null;
  export let search: string = null;
  export let tagType: TagType = 'TOPIC';

  // const hasPrimaryStageTag = (page: Page.CollectionCard) => {
  //   const tag = page.tags.find(p => p.tag.value === title);
  //   if (tag.category === 'PRIMARY') return -1;
  //   else return 1;
  // };

  // pages.sort(function (c: Page.CollectionCard, d: Page.CollectionCard) {
  //   return c.createdAt.valueOf() - d.createdAt.valueOf();
  // });

  // if (tagType === 'STAGE') {
  //   pages.sort(function (a: Page.CollectionCard, b: Page.CollectionCard) {
  //     return hasPrimaryStageTag(a);
  //   });
  // }
</script>

<div class="collection-page">
  <CollectionPageHeader {title} {search} {bio} />
  <div class="content">
    {#if pages.length === 0}
      {#if search}
        <h2>No results found</h2>
      {:else}
        <h2>No pages</h2>
      {/if}
    {:else}
      <CollectionCards {pages} {tagType} />
    {/if}
  </div>
</div>

<style lang="stylus">

  .collection-page {
    --page-padding: 90px;
    --page-max-content-width: 1450px;
  }
  .content {
    background: #ffffff;
    padding: 30px var(--page-padding);
    max-width: var(--page-max-content-width);
    margin: auto;
    h2 {
      typography: h3-light-responsive;
    }
  }
  @media (max-width: 1024px) {
    .collection-page {
      --page-padding: 40px;
    }
  }
  @media (max-width: 768px) {
    .collection-page {
      --page-padding: 20px;
    }
  }
</style>
