<script lang="ts">
  import type { Page } from '@mpa/db';
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import { onMount } from 'svelte';
  import ContentCarouselCard from './ContentCarouselCard.svelte';
  import ContentCarouselLoadingCard from './ContentCarouselLoadingCard.svelte';
  import { SplideOptions } from '$lib/helpers/splide';
  import * as api from '$lib/api';
  import { userHistory } from '$lib/history';

  export let title: string;
  export let referencePage: Page = undefined;
  export let recommendationType: 'chapter' | 'case-study';

  let slides: Page.ContentCard[];

  const NUM_RECOMMENDATIONS = 8;

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
        padding: { left: '22.5%', right: '0%' }
      }
    }
  });

  onMount(async () => {
    slides = await api.recommendations.get(userHistory.toApiRequest(), recommendationType, referencePage?.id);
  });
</script>

<div class="content-carousel">
  <p class="title">{title}</p>
  <Splide {options}>
    {#if !slides}
      {#each Array(NUM_RECOMMENDATIONS) as _}
        <SplideSlide>
          <ContentCarouselLoadingCard />
        </SplideSlide>
      {/each}
    {:else}
      {#each slides as slide}
        <SplideSlide>
          <ContentCarouselCard page={slide} />
        </SplideSlide>
      {/each}
    {/if}
  </Splide>
  <div class="opacity-div" />
</div>

<style lang="postcss">
  .content-carousel {
    position: relative;
    color: #6c767d;
    line-height: 40px;
    background-color: $c-neutral-bg;
    box-shadow: inset 0 2px 12px rgb(0 0 0 / 5%);
    border-radius: 40px 0 0 40px;
    padding: 0.5rem 0 2rem 1.5rem;

    :global(.splide__arrow) {
      background: #fffd;
    }

    :global(.splide__arrow:disabled) {
      display: none;
    }
  }

  .title {
    font: $f-h5;
    color: black;
  }

  .opacity-div {
    height: 100%;
    width: 15%;
    background: linear-gradient(to right, color($c-neutral-bg alpha(0)), $c-neutral-bg);
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
