<script lang="ts">
  import landingMadlibBg from '$lib/assets/landing-madlib-bg.jpg';
  import { InlineSvgLink, Searchbar } from '$lib/components/generic';

  export let title: string;
  export let search: string;
  export let bio: string;

  let focusSearch: () => void;

  $: if (search && focusSearch) focusSearch();
</script>

<div class="container" style="background-image: url({landingMadlibBg})">
  <div class="mpath-logo">
    <InlineSvgLink href="/" svg="UNEP" />
  </div>

  <div class="content">
    <h2 class="text">{title}</h2>
    <div class="search-bar">
      <Searchbar type={'collection'} bind:focus={focusSearch} />
    </div>
  </div>
  {#if bio != null}
    <div class="biography-container">
      <div class="content biography-text-area">
        <p>{bio}</p>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .container {
    position: relative;
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
    @mixin font-responsive h2;

    color: #fff;
    margin: 0;
  }

  .search-bar {
    flex: 1;
    min-width: 500px;
    max-width: 700px;
  }

  .biography-text-area {
    padding: 20px var(--page-padding);
    height: auto;

    p {
      color: #fff;
      font: $f-p-mobile;
      width: 850px;
    }
  }

  .biography-container {
    background-color: color($c-primary-blue alpha(0.7));
    box-shadow: inset 0 3px 16px rgb(0 0 0 / 15%);
  }

  .mpath-logo {
    position: absolute;
    margin: 2rem;
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
