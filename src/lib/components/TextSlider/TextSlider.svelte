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
  export let buttonColor: string = '#fbe26b';
  export let textColor: string = '#202020';
  export let currentPageIndex: number = 0;
  export let width: number = 800;
  export let height: number = 300;

  let splide: any;
  let controller: any;

  let options = {
    rewind: true,
    width: width,
    height: height,
    gap: -3,
    pagination: false,
    arrows: false
  };

  const components = {
    cardbody: CardBody,
    cardheading: CardHeading
  };

  onMount(() => {
    controller = splide.splide.Components.Controller;
  });
  const handlePrevButton = () => {
    splide.go(controller.getPrev());
  };
  const handleNextButton = () => {
    splide.go(controller.getNext());
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
      <div on:click={handlePrevButton} class="button prev" style="background-color: {buttonColor};">&#10094;</div>
      <div on:click={handleNextButton} class="button next" style="background-color: {buttonColor};">&#10095;</div>
    </div>
    {#each block.content as slide, i}
      <SplideSlide on:move={handleMove}>
        <div class="slide" style="background: {backgroundColor};">
          <div class="info" style="color: {textColor};">
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
        </div>
      </SplideSlide>
    {/each}
    <div slot="after-track" class="custom-dots">
      <CarouselDots
        {currentPageIndex}
        pagesCount={block.content.length}
        progress={true}
        color={textColor}
        {handleDotClick}
      />
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
    width: max-content;
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
    border: rgba(0, 0, 0, 0.1) solid 1px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 10px;
    text-align: center;
    line-height: 40px;
  }
  .navigationButtons .button:hover {
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.2);
  }
  .slide {
    overflow: hidden;
    height: 100%;
  }
  .info {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue',
      sans-serif;
    top: 0;
    padding: 15px var(--contentPadding);
    height: 80%;
  }
  .custom-dots {
    position: absolute;
    bottom: 10px;
    left: 0;
  }
</style>
