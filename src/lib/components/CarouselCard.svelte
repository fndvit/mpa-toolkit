<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import TagContainer from "$lib/components/TagContainer.svelte";
  import { staticUrl } from "$lib/helpers/content";

  export let page: SubTypes.Page.ContentCard;

  const category = page.tags?.length > 0 && page.tags[0].tag.value;

</script>

<a
  class="container"
  href="/{page.slug}"
  class:case-study={!!page.caseStudy}
  tabindex="0"
>
  <img class="image" src={staticUrl(page.img)} alt="preview">
  <div class="preview-content">
    <div class="circle-button" tabindex="0">
      <svg class="arrow-svg" viewBox="0 0 12 20">
        <path class="arrow-path" d="M1.1814 19L9.81849 10L1.1814 1" />
      </svg>
    </div>
    <div class="category">{category ?? ''}</div>
    <div class="title">{@html page.title}</div>
    <div class="tags-title">What's this about?</div>
    <TagContainer tags={page.tags}/>
  </div>
</a>


<style lang="scss">

  .arrow-svg {
    width: 12px;
    height: 20px;
    fill: none;
    transform: translateX(2px);
  }

  .arrow-path {
    stroke:#2A2A2A ;
    stroke-width: 2.4px;
  }

  .circle-button {
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #FBE26B;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
    margin-right: 1.5rem;
    margin-top: 0.25rem;
  }

  .circle-button:hover{
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.35);
  }

  .tags-title {
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    font-weight: 700;
    font-size: 16px;
  }

  .title {
    font-weight: 275;
    font-size: 32px;
    max-width: 570px;
    margin-top: 0px;
    max-height: 120px;
    text-overflow: clip;
    word-wrap: break-word;
    overflow: hidden;
  }

  .category {
    font-weight: 700;
    font-size: 20px;
    max-width: 720px;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  .preview-content {
    color: #FFFFFF;
    padding-left: 1.5rem;
  }

  .image {
    border-radius: 40px 40px 0px 0px;
    width: 766px;
    height: 344px;
  }

  a.container {
    text-decoration: none;
  }

  .container {
    display: inline-block;
    width: 766px;
    height: 671px;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
    border-radius: 40px;
    border: none;
    margin-bottom: 25px;
    background: #096EAE;

    &.case-study {
      background: #13487C;
    }

    &:hover {
      filter: brightness(105%);
    }

    :global(.tag-container) {
      max-width: 600px;
    }

  }

</style>