<script lang="ts">
  import type { Page } from '@mpa/db';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import { TagContainer } from '$lib/components/shared';
  import { getPageDisplayTitle } from '$lib/helpers/content';
  import type { PictureSource } from '../generic/PictureSources.svelte';
  import Picture from '../generic/Picture.svelte';

  export let page: Page.ContentCard;

  const config: PictureSource[] = [{ width: [300, 500], minWidth: 1320 }, { width: [210, 400] }];

  $: fallbackImg = page.chapter ? chapterDefaultImage : caseStudyDefaultImage;
</script>

<a class="landing-carousel-card" href="/{page.slug}" class:case-study={!!page.caseStudy} tabindex="0" rel="external">
  <Picture src={page.img} fallback={fallbackImg} alt={page.title} {config} />

  <div class="preview-content">
    <div class="title">
      <span><h3>{getPageDisplayTitle(page)}</h3></span>
      <!-- TODO: a11y -->
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    </div>

    <div>
      <div class="tags-title">
        <h5>What's this about?</h5>
      </div>
      <div class="tags no-drag hide-scrollbar">
        <TagContainer tags={page.tags} />
      </div>
    </div>
  </div>
</a>

<style lang="postcss">

  .landing-carousel-card {
    --lcc-width: 600px;
    display: flex;
    flex-direction: column;
    width: var(--lcc-width);
    box-shadow: 0 4px 16px rgb(0 0 0 / 20%);
    border-radius: 40px;
    border: none;
    background: $c-primary-blue;
    height: 100%;

    &.case-study {
      background: $c-deep-blue;
    }

    &:hover {
      filter: brightness(105%);
    }

    .tags {
      max-width: 600px;
    }

    :global(picture) {
      border-radius: 40px 40px 0 0;
      width: var(--lcc-width);
      height: calc(var(--lcc-width) * 0.45);
      object-fit: cover;
      overflow: hidden;

      :global(img) {
        width: 100%;
        margin: auto;
        object-position: center;
        object-fit: cover;
      }
    }
  }

  a.landing-carousel-card {
    text-decoration: none;
  }

  .tags-title {
    margin: 2.5rem 0 1rem;

    h5 {
      font: $f-h5;
      margin: 0;
    }
  }

  .title {
    text-overflow: clip;
    word-wrap: break-word;
    display: flex;
    justify-content: space-between;

    > span {
      flex: 0 1 570px;
      display: -webkit-box;
      line-clamp: 4;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
    }

    h3 {
      @mixin font-responsive h3-light;
      margin: 0;
    }
  }

  .preview-content {
    color: #fff;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }

  @media (max-width: 1024px) {
    .landing-carousel-card {
      max-width: 500px;
      width: calc(100vw - 120px);

      :global(picture) {
        width: 100%;
        aspect-ratio: 1.5 / 1;
        @supports (aspect-ratio: 1.25 / 1) {
          height: auto;
          min-height: 240px;
        }
      }
    }

    .tags-title {
      display: none;
    }

    .preview-content {
      padding: 1rem 1.5rem 1.5rem;
    }

    .tags {
      margin-top: 2rem;
      overflow-x: scroll;

      > :global(.tag-container) {
        flex-wrap: nowrap;
      }
    }
  }

  @media (max-width: 550px) {
    .landing-carousel-card {
      max-width: 500px;
      width: calc(100vw - 80px);
    }
  }
</style>
