<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import TagContainer from "$lib/components/TagContainer.svelte";
  import { staticUrl } from "$lib/helpers/content";
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';

  export let page: SubTypes.Page.ContentCard;

  $: fallbackImg = page.chapter ? chapterDefaultImage : caseStudyDefaultImage;

</script>

<a
  class="carousel-card"
  href="/{page.slug}"
  class:case-study={!!page.caseStudy}
  tabindex="0"
>

  <img class="image" src={staticUrl(page.img, fallbackImg)} alt="preview">

  <div class="preview-content">
    <div class="title">
      <span>{@html page.title}</span>
      <div class="circle-button" tabindex="0">
        <svg class="arrow-svg" viewBox="0 0 12 20">
          <path class="arrow-path" d="M1.1814 19L9.81849 10L1.1814 1" />
        </svg>
      </div>
    </div>

    <div>
      <div class="tags-title">What's this about?</div>
      <div class="tags no-drag hide-scrollbar">
        <TagContainer tags={page.tags}/>
      </div>
    </div>
  </div>
</a>


<style lang="scss">

  .carousel-card {
    display: flex;
    flex-direction: column;
    width: 766px;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
    border-radius: 40px;
    border: none;
    background: #096EAE;
    height: 100%;

    &.case-study {
      background: #13487C;
    }

    &:hover {
      filter: brightness(105%);
    }

    .tags {
      max-width: 600px;
    }

  }

  a.carousel-card {
    text-decoration: none;
  }

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
    display: flex;
    flex: 0 0 72px;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #FBE26B;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
  }

  .circle-button:hover{
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.35);
  }

  .tags-title {
    margin: 2.5rem 0 1rem;
    font-weight: 700;
    font-size: 16px;
  }

  .title {
    font-weight: 275;
    font-size: 32px;
    max-height: 5em;
    text-overflow: clip;
    word-wrap: break-word;
    display: flex;
    justify-content: space-between;
    > span {
      flex: 0 1 570px;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      line-clamp: 4;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
    }
  }

  .preview-content {
    color: #FFFFFF;
    padding: 2rem 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }

  .image {
    border-radius: 40px 40px 0px 0px;
    width: 766px;
    height: 344px;
    object-fit: cover;
  }

  @media(max-width: 1024px) {

    .carousel-card {
      max-width: 500px;
      width: calc(100vw - 120px);
    }

    .image {
      width: 100%;
      aspect-ratio: 1.5 / 1;
      @supports (aspect-ratio: 1.25 / 1) {
        height: auto;
        min-height: 240px;
      }
    }

    .circle-button, .tags-title {
      display: none;
    }

    .preview-content {
      padding: 1rem 1.5rem 1.5rem;
    }

    .title {
      font-size: 1.75rem;
    }

    .tags {
      margin-top: 2rem;
      overflow-x: scroll;
      > :global(.tag-container) {
        flex-wrap: nowrap;
      }
    }

  }

  @media(max-width: 550px) {

    .carousel-card {
      max-width: 500px;
      width: calc(100vw - 80px);
    }

    .title {
      font-size: 1.25rem;
    }

  }

</style>