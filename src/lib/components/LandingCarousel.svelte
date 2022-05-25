<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import {Splide, SplideSlide} from "@splidejs/svelte-splide";
  import CarouselDots from './Cards/CarouselDots.svelte';
  import CarouselCard from './CarouselCard.svelte';
  import { SplideOptions } from '$lib/helpers/splide';

  export let pages: SubTypes.Page.ContentCard[];
  export let title: string;

  let currentCard = 0;
  let splide: Splide;

  const options = SplideOptions({
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
  });

  $: if (currentCard >= 0 && splide) splide.go(currentCard);

</script>

<div class="container">
  <div class="title-container">
    {@html title}
    <CarouselDots
      bind:currentPageIndex={currentCard}
      pagesCount={pages.length}
      progress={true}
    />
  </div>
  <div class="carousel-container">
    <Splide {options} bind:this={splide}
      on:mounted={ (e) => currentCard = e.detail.splide.index}
      on:move={(e) => currentCard = e.detail.index}
    >
      {#each pages as page}
        <SplideSlide>
          <CarouselCard {page}/>
        </SplideSlide>
      {/each}
    </Splide>
  </div>
</div>

<style lang="scss">

  .container {

    :global(.splide__arrow--prev){
      left: 2rem;
    }

    :global(.splide__arrow--next){
      right: 2rem;
    }

    :global(.splide__arrow) {
      background-color: #F9F9F9;
      opacity: 0.5;
    }

    :global(.splide__arrow:hover) {
      opacity: 0.8;
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