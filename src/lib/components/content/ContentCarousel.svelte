<script lang="ts">
  import type { SubTypes } from '$lib/types';
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import { SplideOptions } from '$lib/helpers/splide';
  import ContentCarouselCard from './ContentCarouselCard.svelte';

  export let slides: SubTypes.Page.ContentCard[];
  export let title: string;

  const options = SplideOptions({
    type: 'slide',
    rewind: false,
    perMove: 2,
    gap: 30,
    autoWidth: true,
    pagination: false,
    padding: { right: '13%' },
    noDrag: '.no-drag, .no-drag *',
    breakpoints: {
      1024: {
        perMove: 1
      },
      768: {
        autoWidth: true,
        gap: 50,
        padding: {left: '22.5%', right: '0%'}
      }
    }
  });

</script>

<div class="content-carousel">
  <p class="title">{title}</p>
  <Splide {options}>
    {#each slides as slide}
      <SplideSlide>
        <ContentCarouselCard page={slide}/>
      </SplideSlide>
    {/each}
  </Splide>
  <div class="opacity-div" />
</div>

<style lang="stylus">

  .content-carousel {
    position: relative;
    color: #6C767D;
    line-height: 40px;
    background-color: $colors.neutral-bg;
    box-shadow: inset 0px 2px 12px rgba(0, 0, 0, 0.05);
    border-radius: 40px 0px 0px 40px;
    padding: 0.5rem 0 2rem 1.5rem;

    :global(.splide__arrow) {
      background: #ffffffdd;
    }

    :global(.splide__arrow:disabled){
      display: none;
    }

  }

  .title {
    typography: h5;
    color: black;
  }

  .opacity-div {
    height: 100%;
    width: 15%;
    background: linear-gradient(to right, alpha($colors.neutral-bg, 0), $colors.neutral-bg);
    position: absolute;
    top: 0;
    right: 0;
  }

  @media screen and (max-width: 768px) {

    .content-carousel {
      :global(.splide__arrow) {
        transform: scale(0.75);
      }
    }
  }

  @media screen and (max-width: 840px) {

    .content-carousel {
      border-radius: 0;
    }
  }


</style>