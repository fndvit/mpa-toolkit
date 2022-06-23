<script lang="ts">
  import InlineSvg from "./generic/InlineSvg.svelte";
  import Searchbar from './generic/Searchbar.svelte';
  import landingMadlibBg from '$lib/assets/landing-madlib-bg.jpg';

  export let title: string;
  export let search: string;

  let focusSearch: () => void;

  $: if (search && focusSearch) focusSearch();
</script>

<div class="container" style="background-image: url({landingMadlibBg})">
  <div class="unep-logo">
    <InlineSvg href="https://www.unep.org" svg="UNEP" />
  </div>

  <div class="content">
    <h2 class="text">{title}</h2>
    <div class="search-bar">
      <Searchbar type={'collection'} bind:focus={focusSearch} />
    </div>
  </div>
</div>

<style lang="stylus">
  .container {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
  .content {
    height: 336px;
    padding: 40px var(--page-padding);
    display: flex;
    justify-content: space-between;
    align-items: end;
    align-content: end;
    row-gap: 40px;
    flex-wrap: wrap;
    column-gap: 60px;
    max-width: var(--page-max-content-width);
    margin: auto;
  }
  .text {
    typography: h2-responsive;
    color: #ffffff;
    margin: 0;
  }
  .search-bar {
    flex: 1;
    min-width: 500px;
    max-width: 700px;
  }
  .unep-logo {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 110px;
    color: white;
  }

  @media only screen and (max-width: 1024px) {
    .container {
      row-gap: 40px;
    }

    .search-bar {
      width: 100%;
      min-width: auto;
    }
  }
</style>
