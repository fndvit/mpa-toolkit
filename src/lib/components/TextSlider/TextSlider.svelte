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
    <div class="navigationButtons" slot="before-track">
    {#if block.content.length > 1}
      <div on:click={handlePrevButton} class="button prev">&#10094;</div>
      <div on:click={handleNextButton} class="button next">&#10095;</div>
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
        <CarouselDots
          {currentPageIndex}
          pagesCount={block.content.length}
          progress={false}
          color={textColor}
          {handleDotClick}
        />
      {/if}
    </div>
  </Splide>
</div>

<style type="text/postcss">
  :root {
    --contentPadding: 30px;
    --scrollbarWidth: 10px;
  }
  .container :global(.splide__track) {
    border-radius: 15px;
  }
  .container {
    border-radius: 15px;
  }
  .navigationButtons {
    width: 100px;
    display: inline-flex;
    position: absolute;
    z-index: 2;
    right: 0;
    margin-top: 20px;
    margin-right: 20px;
  }
  .navigationButtons .button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 10px;
    text-align: center;
    line-height: 40px;
    font-size: 25px;
    color: rgba(0, 0, 0, 0.7);
    background-color: transparent;
  }
  .navigationButtons .button:hover {
    color:  black
  }
  .slide {
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue',
      sans-serif;
    top: 0;
    padding: 15px var(--contentPadding);
  }
</style>
