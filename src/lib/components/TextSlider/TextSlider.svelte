<script lang="ts">
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import CarouselDots from './CarouselDots.svelte';
  import CardHeading from './CardHeading.svelte';
  import CardBody from './CardBody.svelte';
  import type { CardsBlock } from '$lib/types';
  import { SplideOptions } from '$lib/helpers/splide';

  export let block: CardsBlock;
  export let backgroundColor: string = '#fbe26b';
  export let textColor: string = '#202020';
  export let currentPageIndex: number = 0;

  let splide: Splide;

  let options = SplideOptions({
    rewind: true,
    autoHeight: true,
    gap: -3,
    pagination: false
  });

  const components = {
    cardbody: CardBody,
    cardheading: CardHeading
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
  <Splide {options} bind:this={splide} on:move={handleMove}>
    {#each block.content as slide}
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

    :global(.splide__arrows) {
      position: absolute;
      right: 24px;
      top: 44px;
      display: flex;
      column-gap: 10px;;
    }

    :global(.splide__arrow) {
      position: static;
      background: transparent;
    }
  }

  .slide {
    overflow: hidden;
    font-family: 'Montserrat';
    top: 0;
    padding: 15px var(--contentPadding);
    margin-bottom: 15px;
  }
</style>
