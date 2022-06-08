<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import TagContainer from "$lib/components/TagContainer.svelte";
  import { staticUrl } from "$lib/helpers/content";

  export let page: SubTypes.Page.ContentCard;

  const {slug, img, title, tags} = page;
</script>

<div class="container" tabindex="0">
  <a href={"/" + slug}>
    <img src={staticUrl(img)} alt="interesting-chapters" href={"/" + slug}/>
    <div class="title font-h5-light">{title}</div>
  </a>

  <div class="tags no-drag hide-scrollbar">
    <TagContainer {tags}/>
  </div>

</div>

<style lang="scss">

  .container {
    width: 292px;
    --tag-bg: #dadce0;
  }

  .tags {
    line-height: 18px;
    max-width: 292px;
  }

  img {
    width: 100%;
    margin-bottom: 10px;
    a:hover & {
      filter: brightness(105%);
    }
  }

  .title {
    line-height: 1.5rem;
    padding-left: 0.15rem;
    margin-bottom: 1rem;
    color: black;
  }

  @media (max-width: 1320px) {
    .container {
      max-width: 210px;
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