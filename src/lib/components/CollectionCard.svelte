<script lang="ts">
  import type { SubTypes } from '$lib/types';
  import { staticUrl } from '$lib/helpers/content';
  import TagContainer from '$lib/components/TagContainer.svelte';

  export let page: SubTypes.CollectionCard;

  const authors = page.chapter?.authors?.map(a => a.name);
  const authorsString = authors && (
    authors.length > 1
      ? `${authors.slice(0, -1).join(',')} and ${authors.slice(-1)}`
      : authors.toString()
  );

</script>

<a class="container" href='/{page.slug}' rel="external">
  <div class="image">
    <img src={staticUrl(page.img)} alt="chapter" />
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
  </div>
  <div class="tags">
    <b>What's this about</b>
    <TagContainer tags={page.tags}/>
  </div>
</a>

<style lang="scss">
  .container {
    grid-template-columns: 12rem 1fr 20rem;
    column-gap: 1rem;
    display: grid;
    background: #f9f9f9;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    margin: 15px;
    padding-right: 10px;
    height: 200px;
    &:hover {
      text-decoration: none;
      filter: brightness(105%);
    }
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
    width:  12rem;
    height: 100%;
    object-fit: cover;
    border-radius: 12px 0px 0px 12px;
  }
  .text{
    padding: 15px;
  }
  .bottom-section {
    display: flex;
    column-gap: 15px;
    margin-top: 15px;
    color: #6C767D;
  }
  .tags {
    display: flex;
    flex-direction: column;
    height: 200px;
    box-sizing: border-box;
    padding: 15px;
    :global(.tag) {
      --tag-bg: #DADCE0;
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
      grid-template-columns: 12rem 1fr 20rem;
    }
  }

</style>
