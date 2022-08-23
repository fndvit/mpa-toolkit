<script lang="ts">
  import type { PageData } from './$types';
  import TagsEditor from '$lib/components/cms/TagsEditor.svelte';

  export let data: PageData;
</script>

<div class="container">
  <div class="title">
    <a href="/cms"><span class="material-icons arrow">navigate_before</span></a>
    <h1>Tags</h1>
  </div>

  <TagsEditor tags={data.tags} />
</div>

<style lang="stylus">

  .container {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem 6rem;
    typography: ui;
    width: fit-content;
    margin: 0 auto;
  }

  .title {
    display: flex;
    align-items: center;
    column-gap: 30px;

    h1 {
      typography: h2-responsive;
    }

    .arrow {
     color: black;
     font-size: 32px;
    }
  }

</style>
