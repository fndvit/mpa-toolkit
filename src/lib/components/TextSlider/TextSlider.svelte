<script lang="ts">
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import { onMount } from 'svelte';
  import '@splidejs/splide/dist/css/splide.min.css';
  import CarouselDots from './CarouselDots.svelte';
  import CardHeading from './CardHeading.svelte';
  import CardBody from './CardBody.svelte';
  import type { CardsBlock } from '$lib/types';

  export let block: CardsBlock;
  export let backgroundColor: string = '#fbe26b';
  export let textColor: string = '#202020';
  export let currentPageIndex: number = 0;

  let splide: Splide;

  let options = {
    rewind: true,
    autoHeight: true,
    gap: -3,
    pagination: false,
    arrows: false
  };

  const components = {
    cardbody: CardBody,
    cardheading: CardHeading
  };

  const handlePrevButton = () => {
    splide.go(splide.splide.Components.Controller.getPrev());
  };
  const handleNextButton = () => {
    splide.go(splide.splide.Components.Controller.getNext());
  };
  const handleDotClick = (index) => {
    splide.go(index);
  };
  const handleMove = (event) => {
    currentPageIndex = event.detail.index;
  };

  $: if (currentPageIndex >= 0 && splide) splide.go(currentPageIndex);
</script>

<div class="container" style="background-color: {backgroundColor};">
  <Splide bind:options bind:this={splide} on:move={handleMove}>
    <div class="navigationButtons" slot="before-track" style="background-color: {backgroundColor}">
    {#if block.content.length > 1}
      <div on:click={handlePrevButton} class="button prev">
        <svg width="13" height="21" viewBox="0 0 13 21" fill="none">
          <path d="M11.2815 1.39026L2.6444 10.3903L11.2815 19.3903" stroke="#2A2A2A" stroke-width="2.4"/>
        </svg>
      </div>
      <div on:click={handleNextButton} class="button next">
        <svg width="12" height="21" viewBox="0 0 12 21" fill="none">
          <path d="M1.64441 19.3903L10.2815 10.3903L1.64441 1.39026" stroke="#2A2A2A" stroke-width="2.4"/>
        </svg>
      </div>
    {/if}
  </div>
    {#each block.content as slide, i}
      <SplideSlide on:move={handleMove}>
        <div class="slide" style="background: {backgroundColor}; color: {textColor};">
          {#each slide.content as slideblock}
            {#if components[slideblock.type] && slide.type === 'card'}
              <svelte:component this={components[slideblock.type]} block={slideblock} />
            {:else}
              {@debug block}
              <div class="unknown-block">
                Unknown block type: {slideblock.type}
              </div>
            {/if}
          {/each}
        </div>
      </SplideSlide>
    {/each}
    <div slot="after-track">
      {#if block.content.length > 1}
      <div class="carousel-dots">
        <CarouselDots
          {currentPageIndex}
          pagesCount={block.content.length}
          progress={true}
          color={textColor}
          {handleDotClick}
        />
      </div>
      {/if}
    </div>
  </Splide>
</div>

<style type="scss">

  .carousel-dots {
    padding-bottom: 20px;
  }

  .container :global(.splide__track) {
    border-radius: 15px;
  }

  .container {
    --contentPadding: 30px;
    --scrollbarWidth: 10px;
    border-radius: 15px;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
  }

  .navigationButtons {
    position: absolute;
    display: block;
    z-index: 2;
    right: 0;
    margin-top: 20px;
    margin-right: 20px;
    padding-right: 4px;
    width: 104px;
  }

  .button {
    height: 48px;
    width: 48px;
    cursor: pointer;
    text-align: center;
    line-height: 45px;
    font-size: 32px;
    color: "#2A2A2A";
    border-radius: 50%;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
  }

  .prev {
    float: left;
  }

  .next {
    float: right;
  }

  .button:hover {
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.30);
  }

  .slide {
    overflow: hidden;
    font-family: 'Montserrat';
    top: 0;
    padding: 15px var(--contentPadding);
    margin-bottom: 15px;
  }
</style>
