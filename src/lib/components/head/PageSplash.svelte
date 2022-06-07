<script lang="ts">
  import type { Modify } from "$lib/helpers/utils";
  import type { SubTypes } from "$lib/types";
  import InlineSvg from "../generic/InlineSvg.svelte";
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';
  import { staticUrl } from "$lib/helpers/content";
  import EditableText from "../generic/EditableText.svelte";

  type PageForSplash = Modify<
    Pick<SubTypes.Page.Full, 'title' | 'img'>,
    { caseStudy?: {name: string} }
  >;

  export let page: PageForSplash;
  export let editable = false;

  $: fallbackImg = page.caseStudy ? caseStudyDefaultImage : chapterDefaultImage;
  $: img = staticUrl(page.img, fallbackImg);

</script>

<div class="unep-logo">
  <InlineSvg svg="UNEP" />
</div>
<div class="splash" style="background-image: url({img});" class:splash-cs={page.caseStudy}>
  <h1>
    {#if page.caseStudy}
      <EditableText bind:value={page.caseStudy.name} {editable} placeholder="Project name" />
      <span> &#x2013; </span>
    {/if}
    <EditableText bind:value={page.title} {editable} placeholder="Title" />
  </h1>
</div>

<style lang="scss">

  .splash {
    --ec-hover-bg: #ffffff22;
    --ui-color-placeholder: #ffffff55;
    min-height: 60vh;
    display: flex;
    align-items: flex-end;

    padding: 6rem var(--page-padding) 3rem;
    background-size: cover;
    background-position: center center;

    h1 {
      max-width: 800px;
      width: 100%;
      color: white;
      text-shadow: 0px 2px 12px rgba(0, 0, 0, 0.45);
      > :global(*) {
        display: inline;
      }
    }


    &.splash-cs h1 > :global(*:first-child) {
      font-weight: 700;
    }

  }

  .unep-logo {
    position: absolute;
    margin: 2rem;
    width: 110px;
    color: white;
  }

  @media screen and (max-width: 768px) {

    .splash {
      
      padding: 6rem var(--page-padding) 4rem;

      h1 {
        font-size: 4rem;
        line-height: 65px;
        margin-bottom: 0px;
      }


      &.splash-cs h1 {
        padding-bottom: 50px;
      }
    }
  }

  @media screen and (max-width: 500px) {

    .splash {
      padding: 17rem var(--page-padding) 3rem;

      h1 {
        font-size: 3rem;
      }

    }
  }


</style>