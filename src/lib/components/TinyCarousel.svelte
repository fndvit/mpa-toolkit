<script lang="ts">
  import type { SubTypes } from '$lib/types';
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import { SplideOptions } from '$lib/helpers/splide';
  import TinyPreviewCard from './TinyPreviewCard.svelte';

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

<div class="tiny-carousel">
  <p class="title font-h5">{title}</p>
  <Splide {options}>
    {#each slides as slide}
      <SplideSlide>
        <TinyPreviewCard page={slide}/>
      </SplideSlide>
    {/each}
  </Splide>
  <div class="opacity-div" />
</div>

<style type="text/scss">

  .tiny-carousel {
    position: relative;
    color: #6C767D;
    background-color: #F9F9F9;
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
    color: black;
  }

  .opacity-div {
    height: 100%;
    width: 15%;
    background: linear-gradient(to right, #f9f9f900, #f9f9f9);
    position: absolute;
    top: 0;
    right: 0;
  }

  @media screen and (max-width: 768px) {

    .tiny-carousel {
      :global(.splide__arrow) {
        transform: scale(0.75);
      }
    }
  }

  @media screen and (max-width: 840px) {

    .tiny-carousel {
      border-radius: 0;
    }
  }


</style>