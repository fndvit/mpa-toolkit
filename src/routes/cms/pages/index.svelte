<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import CollectionCards from "$lib/components/CollectionCards.svelte";
  import IconButton from "$lib/components/generic/IconButton.svelte";
  import { groupBy } from "$lib/helpers/utils";

  export let pages: SubTypes.Page.CollectionCard[];

  const grouped = groupBy(pages, p => p.draft ? 'draft' : 'live');
</script>

<div class="container">
  <div class="title">
    <h1>Pages</h1>
    <IconButton href="/cms/pages/create/chapter" icon="add" text="New Chapter" />
    <IconButton href="/cms/pages/create/case-study" icon="add" text="New Case study" />
  </div>

  <div class="pages">
    <h3>Draft</h3>
    {#if grouped.draft}
      <CollectionCards pages={grouped.draft} cms />
    {:else}
      No draft pages
    {/if}
  </div>
  <div class="pages">
    <h3>Live</h3>
    {#if grouped.live}
      <CollectionCards pages={grouped.live} cms />
      {:else}
        No live pages
    {/if}
  </div>
</div>

<style lang="scss">
  .container {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    margin: 0px auto;
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
  }
</style>