<script lang="ts">
  import TagContainer from "../Tags/TagContainer.svelte";
  import { staticUrl } from "$lib/helpers/content";
  import type { PageTag } from "$lib/types";

  export let tags: PageTag[];
  export let title: string;
  export let img: string;
  export let slug: string;
</script>

<div class="container" tabindex="0">
  <a href={"/" + slug}>
    <img src={staticUrl(img)} alt="interesting-chapters" href={"/" + slug}/>
    <div class="title">{title}</div>
  </a>
  <TagContainer {tags}/>
</div>

<style lang="scss">
  .container {
    width: 292px;
  }

  img {
    width: 100%;
    margin-bottom: 10px;
    a:hover & {
      filter: brightness(105%);
    }
  }

  .title {
    font-family: 'Montserrat';
    font-size: 20px;
    font-weight: 300;
    line-height: 25px;
    padding-left: 0.15rem;
    margin-bottom: 0.5rem;
    color: black;
  }

  @media (max-width: 1320px) {
    .container {
      max-width: 210px;
    }
    .title {
      font-size: 18px;
      line-height: 22px;
    }
  }
</style>