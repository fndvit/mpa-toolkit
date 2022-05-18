<script lang="ts">
  import '@splidejs/splide/dist/css/splide.min.css';
  import {Splide, SplideSlide} from "@splidejs/svelte-splide";
  import CarouselDots from './TextSlider/CarouselDots.svelte';
  import CarouselCard from './CarouselCard.svelte';
  import type { Options } from '@splidejs/splide';

  export let type: 'chapter'|'case study';

  //Dummy summary cards
  let p0 = {
    previewImage: '/static/chapter-preview-image.png',
    category: 'Sustainable financing',
    title: '0-What should MPA managers know about the blue economy and business planning?',
    slug: 'what-should-mpa-managers-0'
  };

  let p1 = {
    previewImage: '/static/chapter-preview-image.png',
    category: 'Sustainable financing',
    title: '1-What should MPA managers know about the blue economy and business planning?',
    slug: 'what-should-mpa-managers-1'
  };

  let p2 = {
    previewImage: '/static/chapter-preview-image.png',
    category: 'Sustainable financing',
    title: '2-What should MPA managers know about the blue economy and business planning?',
    slug: 'what-should-mpa-managers-2'
  };

  let p3 = {
    previewImage: '/static/chapter-preview-image.png',
    category: 'Sustainable financing',
    title: '3-What should MPA managers know about the blue economy and business planning?',
    slug: 'what-should-mpa-managers-3'
  };

  let p4 = {
    previewImage: '/static/chapter-preview-image.png',
    category: 'Sustainable financing',
    title: '4-What should MPA managers know about the blue economy and business planning?',
    slug: 'what-should-mpa-managers-4'
  };

  let parameters = [p0, p1, p2, p3, p4];

  let currentCard = 0;
  let splide: Splide;

  const options: Options = {
    type: 'loop',
    perMove: 1,
    gap: '100px',
    autoWidth: true,
    width: '100%',
    focus: 'center',
    slideFocus: true,
    pagination: false,
    arrows: true,
    updateOnMove: true,
    lazyLoad: true,
    keyboard: true
  }

  const handlePaginationEvent = (newIndex: number) => {
    splide.go(newIndex);
  };

</script>

<div class="container">
  <div class="title-container">
    {#if type === 'chapter'}
      Get the <b>answers</b> to all your questions
    {:else}
      Explore what <b>others have done</b>
    {/if}
      <CarouselDots
        currentPageIndex={currentCard}
        pagesCount={parameters.length}
        progress={true}
        color='#2A2A2A'
        handleDotClick={handlePaginationEvent}
      />
  </div>
  <div class="carousel-container">
    <Splide {options} bind:this={splide}>
      {#each parameters as p}
        <SplideSlide>
          <CarouselCard {type} parameters={p}/>
        </SplideSlide>
      {/each}
    </Splide>
  </div>
</div>

<style>

  :global(.splide__arrow--prev){
    transform: translate(5rem, -27px);
  }


  :global(.splide__arrow--next){
    transform: translate(-5rem, -27px);
  }

  :global(.splide__arrow svg) {
    fill: #2A2A2A;
  }

  :global(.splide__arrow) {
    background-color: #F9F9F9;
    height: 48px;
    width: 48px;
  }

  :global(.sc-carousel-dots__container){
    padding: 10px 0px !important;
    margin-top: 15px;
    margin-bottom: 60px;
  }

  :global(.splide__slide){
    opacity: 50%;
    pointer-events: none;
  }

  :global(.splide__slide.is-active) {
    opacity: 100%;
    pointer-events: all;
  }

  .title-container {
    font-size: 48px;
    line-height: 58.51px;
    font-weight: 300;
    color: #2A2A2A;
    max-width: 600px;
    margin-left: 124px;
    margin-top: 25px;
  }

  .carousel-container {
    display: flex;
    position: relative;
  }

</style>