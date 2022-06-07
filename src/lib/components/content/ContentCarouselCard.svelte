<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import TagContainer from "$lib/components/TagContainer.svelte";
  import { staticUrl } from "$lib/helpers/content";

  export let page: SubTypes.Page.ContentCard;

  const {slug, img, title, tags} = page;
</script>

<div class="content-carousel-card" tabindex="0">
  <a href={"/" + slug}>
    <img src={staticUrl(img)} alt="interesting-chapters" href={"/" + slug}/>
    <div class="title">{title}</div>
  </a>
  <TagContainer {tags}/>
</div>

<style lang="scss">
  .content-carousel-card {
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
    margin-bottom: 1rem;
    color: black;
  }

  @media (max-width: 1320px) {
    .content-carousel-card {
      max-width: 210px;
    }
    .title {
      font-size: 18px;
      line-height: 22px;
    }
  }

  @media screen and (max-width: 768px) {
    .title {
      font-size: 16px;
    }
  }

</style>