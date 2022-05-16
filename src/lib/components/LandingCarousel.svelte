<script lang="ts">
  import '@splidejs/splide/dist/css/splide.min.css';
  import {Splide, SplideSlide} from "@splidejs/svelte-splide";
  import CarouselDots from './TextSlider/CarouselDots.svelte';
  import CarouselCard from './CarouselCard.svelte';
  import type { Options } from '@splidejs/splide';

  export let type: 'chapter'|'case study';

  let p0 = {
    previewImage: '/static/chapter-preview-image.png',
    category: 'Sustainable financing',
    title: '0-What should MPA managers know about the blue economy and business planning?'
  };

  let p1 = {
    previewImage: '/static/chapter-preview-image.png',
    category: 'Sustainable financing',
    title: '1-What should MPA managers know about the blue economy and business planning?'
  };

  let p2 = {
    previewImage: '/static/chapter-preview-image.png',
    category: 'Sustainable financing',
    title: '2-What should MPA managers know about the blue economy and business planning?'
  };

  let p3 = {
    previewImage: '/static/chapter-preview-image.png',
    category: 'Sustainable financing',
    title: '3-What should MPA managers know about the blue economy and business planning?'
  };

  let p4 = {
    previewImage: '/static/chapter-preview-image.png',
    category: 'Sustainable financing',
    title: '4-What should MPA managers know about the blue economy and business planning?'
  };

  let parameters = [p0, p1, p2, p3, p4];

  let enabled = new Array<boolean>(parameters.length).fill(false);

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

  const handleMove = (newIndex: number) => {
    enabled[currentCard] = false;
    currentCard = newIndex;
    enabled[currentCard] = true;
  }

  const handlePaginationEvent = (newIndex: number) => {
    splide.go(newIndex);
  }

  const splideMountedEvent = (index: number) => {
    currentCard = index;
    enabled[currentCard] = true;
  }

  const titleText = type === 'chapter' ?
    `Get the <b>answers</b> to all your questions`
    : `Explore what <b>others have done</b>`;

</script>

<div class="container">
  <div class="title-container">
    {@html titleText}
      <CarouselDots
        currentPageIndex={currentCard}
        pagesCount={parameters.length}
        progress={true}
        color='#2A2A2A'
        handleDotClick={handlePaginationEvent}
      />
  </div>
  <div class="carousel-container">
    <Splide
      {options}
      bind:this={splide}
      on:mounted={ (e) => splideMountedEvent(e.detail.splide.index)}
      on:move={(e) => handleMove(e.detail.index)}
    >
      {#each parameters as p, i}
        <SplideSlide>
          <CarouselCard {type} active={enabled[i]} parameters={p}/>
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