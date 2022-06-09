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

<style lang="stylus">
  .content-carousel-card {
    width: 292px;
    a {
      display: flex;
      flex-direction: column;
      row-gap: 0.6rem;
      padding-bottom: 1rem;
    }
    a:hover {
      text-decoration: none;
      img {
        filter: brightness(105%);
      }
      .title {
        color: #555;
      }
    }
  }

  img {
    width: 100%;
  }

  .title {
    font-family: 'Montserrat';
    font-size: 20px;
    font-weight: 300;
    line-height: 25px;
    padding-left: 0.15rem;
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