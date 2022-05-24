<script lang="ts">
  import type { SubTypes } from '$lib/types';
  import { staticUrl } from '$lib/helpers/content';
  import TagContainer from '$lib/components/TagContainer.svelte';
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';
  import { SplideOptions } from '$lib/helpers/splide';
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import Tag from './Tag.svelte';

  export let page: SubTypes.Page.CollectionCard;
  export let cms = false;

  const options = SplideOptions({
    perMove: 1,
    width: '100%',
    autoWidth: true,
    slideFocus: true,
    pagination: false,
    arrows: true,
    updateOnMove: true,
    lazyLoad: true,
    keyboard: true
  });

  $: fallbackImg = page.chapter ? chapterDefaultImage : caseStudyDefaultImage;

  $: authors = page.chapter?.authors?.map((a) => a.name);
  $: authorsString =
    authors && (authors.length > 1 ? `${authors.slice(0, -1).join(',')} and ${authors.slice(-1)}` : authors.toString());

  $: href = cms ? `/cms/pages/${page.id}` : `/${page.slug}`;
</script>

<a class="container" {href} rel="external" class:cms-card={cms}>
  <div class="image">
    <img src={staticUrl(page.img, fallbackImg)} alt="chapter" />
  </div>
  <div class="text">
    <h1 class="title">
      {page.title}
    </h1>
    <div class="bottom-section">
      {#if authorsString}
        <div class="authors">{authorsString}</div>
      {/if}
      <div class="read-time">{page.readTime} min read</div>
    </div>
    <div class="carousel-tags">
      <Splide {options}>
        {#each page.tags as tag}
          <SplideSlide>
            <Tag {tag} />
          </SplideSlide>
        {/each}
      </Splide>
    </div>
  </div>
  <div class="tags">
    <b>What's this about</b>
    <TagContainer tags={page.tags} />
  </div>
</a>

<style lang="scss">
  .container {
    --cc-height: 200px;
    grid-template-columns: 12rem 1fr 20rem;
    column-gap: 1rem;
    display: grid;
    background: #f9f9f9;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    height: var(--cc-height);
    margin: auto;
    &:hover {
      text-decoration: none;
      filter: brightness(105%);
    }

    &.cms-card {
      --cc-height: 160px;
    }
    .carousel-tags {
      display: none;
    }
    :global(.splide__arrows) {
      display: none;
    }
    :global(.splide__pagination) {
      display: none;
    }
    :global(.tag) {
      --tag-bg: #dadce0;
    }
  }
  .carousel-tags{
    width: -webkit-fill-available;
  }
  a.container {
    color: black;
  }

  .title {
    font-size: 1.5rem;
    margin: 0px;
  }

  .authors {
    font-weight: 700;
  }
  .image img {
    width: 12rem;
    height: var(--cc-height);
    object-fit: cover;
    border-radius: 12px 0px 0px 12px;
  }
  .text {
    padding: 15px 0;
    position: relative;
  }
  .bottom-section {
    position: absolute;
    display: flex;
    column-gap: 15px;
    bottom: 22px;
    color: #6c767d;
  }
  .tags {
    display: flex;
    flex-direction: column;
    height: var(--cc-height);
    box-sizing: border-box;
    padding: 15px;
    :global(.tag) {
      --tag-bg: #dadce0;
    }
    :global(.tag-container) {
      overflow: auto;
    }
  }

  @media (max-width: 1200px) {
    .container {
      height: auto;
    }
  }

  @media (max-width: 1024px) {
    .container {
      grid-template-columns: auto auto;
      width: 600px;
      height: 320px;
      .image img {
        width: 7rem;
        height: 320px;
      }
      .tags {
        display: none;
      }
      .text{
        position: relative;
        margin-right: 10px;
      }
      .carousel-tags {
        display: block;
        position: absolute;
        bottom: 10px;
      }
      .bottom-section{
        margin-top: 10px;
        position: static;
      }
      .title{
        font-size: 30px;
      }
    }
  }
  @media only screen and (max-width: 768px) {
      .container{
        width: 371px;
        height: 320px;
        .title{
          font-size: 20px;
        }
        .bottom-section{
          margin-top: 10px;
          display: block;
        }
        .read-time{
          margin-top: 5px;
        }
      }

  }
</style>
