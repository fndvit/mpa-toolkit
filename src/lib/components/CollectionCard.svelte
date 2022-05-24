<script lang="ts">
  import type { SubTypes } from '$lib/types';
  import { staticUrl } from '$lib/helpers/content';
  import TagContainer from '$lib/components/TagContainer.svelte';
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';

  export let page: SubTypes.Page.CollectionCard;
  export let cms = false;

  $: authors = page.chapter?.authors?.map((a) => a.name);
  $: authorsString =
    authors && (authors.length > 1 ? `${authors.slice(0, -1).join(',')} and ${authors.slice(-1)}` : authors.toString());

  $: href = cms ? `/cms/pages/${page.id}` : `/${page.slug}`;
  $: fallbackImg = page.chapter ? chapterDefaultImage : caseStudyDefaultImage;
  $: img = staticUrl(page.img, fallbackImg);
</script>

<a class="collection-card" {href} rel="external" class:cms-card={cms}>
  <div class="image" style="background-image: url({img});">
  </div>
  <div class="content">
    <h1 class="title">
      {page.title}
    </h1>
    <div class="byline">
      {#if authorsString}
        <div class="authors">{authorsString}</div>
      {/if}
      <div class="read-time">{page.readTime} min read</div>
    </div>
    <div class="tags">
      <h3>What's this about</h3>
      <TagContainer tags={page.tags} />
    </div>
  </div>
</a>

<style lang="scss">
  .collection-card {
    --cc-height: 200px;
    --tag-bg: #dadce0;
    display: flex;
    background: #f9f9f9;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    height: var(--cc-height);
    margin: 0;

    &:hover {
      text-decoration: none;
      filter: brightness(105%);
    }

    &.cms-card {
      --cc-height: 160px;
    }
  }

  a.collection-card {
    color: inherit;
  }

  .content {
    margin: auto;
    padding: 12px;
    flex: 1;
    display: grid;
    grid-template-areas:
      "title  tags"
      "byline tags";
    grid-template-columns: 1fr 300px;
    grid-template-rows: 1fr auto;
    column-gap: 1rem;
  }

  .title {
    grid-area: title;
  }

  .byline {
    grid-area: byline;
    display: flex;
    align-items: end;
    column-gap: 0.4rem;
    color: #6C767D;
  }

  .tags {
    grid-area: tags;
    display: flex;
    flex-direction: column;
    row-gap: 0.6rem;
    h3 {
      margin: 0;
      margin-top: 0.3rem;
    }
    > :global(.tag-container) {
      overflow: scroll;
    }
  }

  .title {
    font-size: 1.5rem;
    margin: 0px;
  }

  .authors {
    font-weight: 700;
  }

  .image {
    flex: 0 0 12rem;
    object-fit: cover;
    border-radius: 12px 0px 0px 12px;
    background-size: cover;
    background-position: center center;
  }

  @media (max-width: 1024px) {

    .collection-card {
      height: auto;
    }

    .image {
      flex-basis: 7rem;
    }
    .content {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto auto;
      grid-template-areas: "title" "byline" "tags";
      row-gap: 1rem;
    }
    .title {
      font-size: 1.25rem;
    }
    .byline {
      flex-direction: column;
      align-items: initial;
      row-gap: 0.4rem;
    }
    .tags {
      overflow: hidden;
      h3 {
        display: none;
      }
      > :global(.tag-container) {
        flex-wrap: nowrap;
        overflow-x: scroll;
      }

    }
  }
</style>
