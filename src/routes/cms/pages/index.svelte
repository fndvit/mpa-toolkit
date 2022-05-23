<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import CollectionCards from "$lib/components/CollectionCards.svelte";
  import IconButton from "$lib/components/generic/IconButton.svelte";

  export let pages: SubTypes.Page.CollectionCard[];
</script>

<div class="container">
  <div class="title">
    <h1>Pages</h1>
    <IconButton href="/cms/pages/create/chapter" icon="add" text="New Chapter" />
    <IconButton href="/cms/pages/create/case-study" icon="add" text="New Case study" />
  </div>

  <div class="pages">
    <CollectionCards {pages} cms />
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