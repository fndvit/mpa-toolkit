<script lang="ts">
  import type { Page, TagType } from '@mpa/db';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import { TagContainer } from '$lib/components/shared';
  import { getPageDisplayTitle } from '$lib/helpers/content';
  import Picture from '../generic/Picture.svelte';

  export let page: Page.CollectionCard;
  export let tagType: TagType = 'TOPIC';
  export let cms = false;

  const TITLES: { [key in TagType]: string } = {
    TOPIC: "What's this about",
    USER: 'Good for...',
    STAGE: 'MPA lifecycle'
  };

  $: authors = page.chapter?.authors?.map(a => a.name);
  $: authorsString =
    authors &&
    (authors.length > 1 ? `${authors.slice(0, -1).join(', ')} and ${authors.slice(-1)}` : authors.toString());

  $: href = cms ? `/cms/pages/${page.id}` : `/${page.slug}`;
  $: fallbackImg = page.chapter ? chapterDefaultImage : caseStudyDefaultImage;

  $: tags = page.tags.filter(t => t.tag.type === tagType);
</script>

<a class="collection-card" {href} rel="external" class:cms-card={cms}>
  <Picture src={page.img} fallback={fallbackImg} alt={page.title} title={page.title} config={{ height: [200, 400] }} />
  <div class="collection-card-content">
    <h1 class="title">
      {#if page.highlights}
        {@html page.highlights}
      {:else}
        {getPageDisplayTitle(page)}
      {/if}
    </h1>
    <div class="byline">
      {#if authorsString}
        <div class="authors">{authorsString}</div>
      {/if}
      <div class="read-time">{page.readTime} min read</div>
    </div>
    <div class="tags">
      <h3>{TITLES[tagType]}</h3>
      <TagContainer {tags} />
    </div>
  </div>
</a>

<style lang="postcss">
  .collection-card {
    --cc-height: 200px;

    display: flex;
    background: $c-neutral-bg;
    box-shadow: 0 3px 16px rgb(0 0 0 / 10%);
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

    :global(picture) {
      flex: 0 0 12rem;
      object-fit: cover;
      border-radius: 12px 0 0 12px;
      background-size: cover;
      background-position: center center;
      overflow: hidden;

      :global(img) {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
  }

  a.collection-card {
    color: inherit;
  }

  .collection-card-content {
    padding: 0.75rem 1rem 1rem 1.5rem;
    flex: 1;
    display: grid;
    grid-template:
      'title  tags' 1fr
      'byline tags' auto
      / 1fr 300px;
    column-gap: 1rem;
  }

  .title {
    grid-area: title;

    @mixin font-responsive h4-light;

    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 800px;
    margin: 0;
  }

  .byline {
    grid-area: byline;
    display: flex;
    column-gap: 0.4rem;
    color: $c-neutral-dark;
  }

  .tags {
    grid-area: tags;
    display: flex;
    flex-direction: column;
    row-gap: 0.6rem;

    h3 {
      font: $f-h5;
      margin: 0;
      margin-top: 0.3rem;
    }
  }

  .authors {
    @mixin font-responsive h5;
  }

  .read-time {
    font: $f-ui;
  }

  @media (max-width: 1024px) {
    .collection-card {
      height: auto;

      :global(picture) {
        flex-basis: 7rem;
      }
    }

    .collection-card-content {
      padding: 0.5rem 0.75rem 1rem 1rem;
      grid-template:
        'title' 1fr
        'byline' auto
        'tags' auto
        / 1fr;
      row-gap: 1rem;
    }

    .title {
      -webkit-line-clamp: 5;
      line-clamp: 5;
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
