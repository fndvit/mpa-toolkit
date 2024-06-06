<script lang="ts">
  import type { Page } from '@mpa/db';
  import type { Modify } from '@mpa/utils';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import { EditableText, InlineSvgLink } from '$lib/components/generic';
  import { backgroundImage } from '$lib/helpers/content';

  type PageForSplash = Modify<Pick<Page, 'title' | 'img'>, { caseStudy?: { name: string } }>;

  export let page: PageForSplash;
  export let editable = false;

  $: fallbackImg = page.caseStudy ? caseStudyDefaultImage : chapterDefaultImage;
</script>

<div
  class="splash"
  class:splash-cs={page.caseStudy}
  style:--bg-small={backgroundImage(page.img || fallbackImg, { width: 600 })}
  style:--bg-medium={backgroundImage(page.img || fallbackImg, { width: 1000 })}
  style:--bg-large={backgroundImage(page.img || fallbackImg, { width: 1440 })}
  style:--bg-fallback={backgroundImage(fallbackImg, { width: 1440 })}
>
  <div class="mpath-logo">
    <InlineSvgLink href="/" svg="MPATH_W" />
  </div>
  <h1>
    {#if page.caseStudy}
      <EditableText bind:value={page.caseStudy.name} {editable} placeholder="Project name" />
      <span> &#x2013; </span>
    {/if}
    <EditableText bind:value={page.title} {editable} placeholder="Title" />
  </h1>
</div>

<style lang="postcss">
  .splash {
    --editable-bg-active: #fff2;
    --editable-placeholder-color: #fff5;

    @mixin grid-config content, splash;

    position: relative;
    grid-template-rows: 1fr auto;
    min-height: 60vh;
    padding-bottom: 3rem;
    background-size: cover;
    background-position: center center;
    background-image: var(--bg-large), var(--bg-fallback);

    h1 {
      @mixin font-responsive h1;

      grid-area: title;
      color: white;
      text-shadow: 0 2px 12px rgb(0 0 0 / 45%);

      > :global(*) {
        display: inline;
      }

      > :global(*:empty) {
        display: inline-block;
      }
    }

    &.splash-cs h1 > :global(*:first-child) {
      font-weight: 700;
    }
  }

  .mpath-logo {
    position: absolute;
    margin: 2rem;
    width: 110px;
    color: white;
  }

  @mixin breakpoint content, medium {
    .splash {
      background-image: var(--bg-medium), var(--bg-fallback);

      h1 {
        margin-bottom: 0;
      }

      &.splash-cs h1 {
        padding-bottom: 5rem;
      }
    }
  }
  @mixin breakpoint content, small {
    .splash {
      background-image: var(--bg-small), var(--bg-fallback);

      h1 {
        margin-top: 283px;
      }
    }
  }
</style>
