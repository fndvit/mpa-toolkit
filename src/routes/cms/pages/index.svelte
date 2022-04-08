<script lang="ts">
  import type { Page } from "$lib/types";

  export let pages: Page[];
</script>

<div class="container">
  <h1>Pages</h1>

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