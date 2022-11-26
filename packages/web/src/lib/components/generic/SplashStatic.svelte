<script lang="ts">
  import InlineSvgLink from '$lib/components/generic/InlineSvgLink.svelte';
  import staticSplash from '$lib/assets/static-splash.jpg';
  import TopNavMenu from '$lib/components/generic/TopNavMenu.svelte';

  export let page: string;
  export let subtitle: string = null;
</script>

<div class="splash" style="background-image: url({staticSplash})">
  <div class="upper-container">
    <div class="left-side">
      <InlineSvgLink href="/" svg="MPATH_W" />
    </div>
    <div class="right-side">
      <TopNavMenu current={page} />
    </div>
  </div>

  <div class="title-container">
    <h1>{page}</h1>
    {#if subtitle}
      <h4>{subtitle}</h4>
    {/if}
  </div>
</div>

<style lang="postcss">
  .title-container {
    h1 {
      @mixin font-responsive h1-light;

      color: white;
      margin-bottom: 0.5rem;
    }

    h4 {
      font: $f-h4;
      color: white;
      margin-top: 0.5rem;
    }

    margin-left: var(--page-padding);
  }

  .upper-container {
    width: 100%;
    display: flex;
  }

  .splash {
    min-height: 70vh;
    padding: 0 0 3rem;
    background-size: cover;
    background-position: bottom;

    --page-padding: 6rem;
  }

  .left-side {
    margin: 2.5rem;
    margin-left: var(--page-padding);
    color: white;
    width: 110px;
    flex: 0;
  }

  .right-side {
    margin: 2.5rem;
    margin-right: var(--page-padding);
    flex: 1;
  }

  @mixin breakpoint content, medium {
    .splash {
      --page-padding: 3rem;
    }
  }

  @mixin breakpoint content, small {
    .splash {
      --page-padding: 1.5rem;
    }
  }
</style>
