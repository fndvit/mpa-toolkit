<script lang="ts">
  import type { Page } from "$lib/types";
  import Button from "$lib/components/generic/Button.svelte";

  export let pages: Page[];
</script>

<div class="container">
  <div class="title">
    <h1>Pages</h1>
    <Button href="/cms/pages/create/chapter">New Chapter</Button>
    <Button href="/cms/pages/create/case-study">New Case study</Button>
  </div>

  <div class="pages">
    {#each pages as page}
      <div class="page">

        <div>{page.title}</div>
        <a href="/{page.slug}">View</a>
        <a href="/cms/pages/{page.id}">Edit</a>

      </div>
    {/each}
  </div>

  <a href="/cms/pages/new">New page</a>
</div>

<style>
  .container {
    max-width: 1000px;
    width: 100%;
    padding: 20px;
    margin: 0px auto;
  }

  .title {
    display: flex;
    align-items: center;
    column-gap: 20px;
  }

  .pages {
    display: grid;
    grid-template-columns: 1fr 100px 100px;
    row-gap: 30px;
    margin-bottom: 50px;
  }

  .page {
    display: contents;
  }

</style>