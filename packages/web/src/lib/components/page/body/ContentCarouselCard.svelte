<script lang="ts">
  import type { Page } from '@mpa/db';
  import { TagContainer } from '$lib/components/shared';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import Picture from '$lib/components/generic/Picture.svelte';
  import type { PictureSource } from '$lib/components/generic/PictureSources.svelte';

  export let page: Page.ContentCard;

  const { slug, img, title, tags } = page;

  const config: PictureSource[] = [{ width: [300, 500], minWidth: 1320 }, { width: [210, 400] }];

  $: fallbackImg = page.chapter ? chapterDefaultImage : caseStudyDefaultImage;
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="content-carousel-card" tabindex="0">
  <a href={'/' + slug}>
    <Picture src={img} fallback={fallbackImg} alt={title} {config} />
    <div class="title">{title}</div>
  </a>

  <div class="tags no-drag hide-scrollbar">
    <TagContainer {tags} />
  </div>
</div>

<style lang="postcss">
  .content-carousel-card {
    --ccc-width: 292px;

    width: var(--ccc-width);

    a {
      display: flex;
      flex-direction: column;
      row-gap: 0.6rem;
      padding-bottom: 1rem;
    }

    :global(picture) {
      height: calc(var(--ccc-width) * (9 / 16));

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    a:hover {
      text-decoration: none;

      :global(img) {
        filter: brightness(105%);
      }

      .title {
        color: #555;
      }
    }
  }

  .tags {
    line-height: 18px;
    max-width: var(--ccc-width);
  }

  .title {
    font: $f-h5-light;
    line-height: 1.5rem;
    padding-left: 0.15rem;
    color: black;
  }

  @media (max-width: 1320px) {
    .content-carousel-card {
      --ccc-width: 210px;
    }

    .title {
      line-height: 22px;
    }

    .tags {
      overflow-x: scroll;

      > :global(.tag-container) {
        flex-wrap: nowrap;
      }
    }
  }
</style>
