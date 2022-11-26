<script lang="ts">
  import type { Page } from '@mpa/db';
  import type { Modify } from '@mpa/utils';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import { EditableText, InlineSvgLink } from '$lib/components/generic';
  import { staticUrl } from '$lib/helpers/content';
  import { fallbackBackgroundImage } from '$lib/helpers/utils';

  type PageForSplash = Modify<Pick<Page, 'title' | 'img'>, { caseStudy?: { name: string } }>;

  export let page: PageForSplash;
  export let editable = false;

  $: fallbackImg = page.caseStudy ? caseStudyDefaultImage : chapterDefaultImage;
</script>

<div
  class="splash"
  style={`background-image: url(${staticUrl(page.img) || fallbackImg}) ;`}
  use:fallbackBackgroundImage={fallbackImg}
  class:splash-cs={page.caseStudy}
>
  <div class="mpath-logo">
    <InlineSvgLink href="/" svg="MPATH" />
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
    position: relative;

    @mixin grid-config content, splash;

    grid-template-rows: 1fr auto;

    --editable-hover-bg: #fff2;
    --editable-placeholder-color: #fff5;

    min-height: 60vh;
    padding-bottom: 3rem;
    background-size: cover;
    background-position: center center;

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
      h1 {
        margin-bottom: 0;
      }

      &.splash-cs h1 {
        padding-bottom: 5rem;
      }
    }
  }
  @mixin breakpoint content, small {
    h1 {
      margin-top: 283px;
    }
  }
</style>
