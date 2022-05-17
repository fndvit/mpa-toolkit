<script lang="ts">
  import TagContainer from "../Tags/TagContainer.svelte";
  import { staticUrl } from "$lib/helpers/content";
  import type { PageTag } from "$lib/types";
  
  export let tags: PageTag[];
  export let title: string;
  export let previewImage: string;
  export let slug: string;
</script>

<div class="container" tabindex="0">
  <img class='img' src={staticUrl(previewImage)} alt="interesting-chapters" width="292" height="156" href={"/" + slug}/>
  <a class="preview-title" href={"/" + slug} >{title}</a>
  <TagContainer {tags} width={285}/>
</div>

<style>
  .container {
    display: inline-block;
    max-width: 285px;
    cursor: pointer;
  }
  .preview-title {
    margin-top: 0.25rem;
    font-family: 'Montserrat';
    font-size: 20px;
    font-weight: 300;
    line-height: 24.38px;
    max-width: 285px;
    margin-bottom: 0.5rem;
    padding-left: 0.15rem;
    width: fit-content;
  }
  .preview-title:hover {
    cursor: pointer;
    color: rgb(43, 43, 43);
    transition: all 0.3s;
  }
  .img{
    max-width: 285px;
  }
  .img:hover{
    cursor: pointer;
    transform: scale(1.05);
    transition: all 0.5s;
  }
  @media (max-width: 1320px) {
    .container {
      max-width: 210px;
    }
    .img{
      max-width: 210px;
      max-height: 140px;
    }
  }
</style>