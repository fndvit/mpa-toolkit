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
    gap: 10,
    autoWidth: true,
    pagination: false,
    padding: { right: '13%' }
  });

</script>

<div class="container">
  <div class="content">
    <p class="title">{title}</p>
    <Splide {options}>
      {#each slides as slide}
        <SplideSlide>
          <TinyPreviewCard page={slide}/>
        </SplideSlide>
      {/each}
    </Splide>
    <div class="opacity-div" />
  </div>
</div>

<style type="text/scss">

  .content {
    --margin-breakout: 25px;
    --page-left-margin: 368px;
    position: relative;
    line-height: 40px;
    color: #6C767D;
    background-color: #F9F9F9;
    box-shadow: inset 0px 2px 12px rgba(0, 0, 0, 0.05);
    border-radius: 40px 0px 0px 40px;
    padding: 0.5rem 0 2rem 1.5rem;
    font-family: 'Montserrat';
    font-weight: 400;
    font-size: 20px;
    margin-left: calc(var(--margin-breakout) * -1);
    width: calc(99vw - var(--page-left-margin) + var(--margin-breakout));

    :global(.splide__arrow) {
      background: #ffffffdd;
    }

    :global(.splide__arrow:disabled){
      display: none;
    }

  }

  .title {
    font-family: 'Montserrat';
    font-weight: 700;
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

    .content {
      margin: 0;
      padding-left: 20px;
      --margin-breakout: 0px;
      --page-left-margin: 0px;
      max-width: 100%;
    }

    .title {
      font-size: 14px;
    }

    :global(.splide__arrow) {
      transform: scale(0.75);
    }

  }

</style>