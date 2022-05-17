<script lang="ts">
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import TinyPreviewCard from './TinyPreviewCard.svelte';
  import { onMount } from 'svelte';
  export let slides: (CompletePage & {tags: PageTag[]})[];
  export let title: string;
  import type { Options } from '@splidejs/splide';
  import type { CompletePage, PageTag } from '$lib/types';
  import '@splidejs/splide/dist/css/splide.min.css';
  let currentSlideIndex: number = 0;
  let prevArrow: HTMLElement;
  let nextArrow: HTMLElement;
  let perPage: number = 3;
  let gap: number = 0;
  const options: Options = {
    type: 'slide',
    rewind: false,
    perPage: perPage,
    perMove: 2,
    gap: gap,
    classes: {
      pagination: 'vanish'
    },
    padding: { right: '13%' }
  };
  let handleMove = (event) => {
    currentSlideIndex = event.detail.index;
  };
  let addClass = (element: HTMLElement, cssClass: string) => {
    if (!element) return;
    if (!element.classList.contains(cssClass)) element.classList.add('vanish');
  };
  let removeClass = (element: HTMLElement, cssClass: string) => {
    if (!element) return;
    if (element.classList.contains(cssClass)) element.classList.remove('vanish');
  };
  let splide;
  onMount(() => {
    prevArrow = document.querySelector('.splide__arrow--prev');
    nextArrow = document.querySelector('.splide__arrow--next');
  });
  $: if (currentSlideIndex === 0) addClass(prevArrow, 'vanish');
  else removeClass(prevArrow, 'vanish');
  $: if (currentSlideIndex + perPage === slides.length) addClass(nextArrow, 'vanish');
  else removeClass(nextArrow, 'vanish');
</script>

<div class="container">
  <div class="content">
    <p class="title"><b>{title}</b></p>
    <Splide {options} bind:this={splide} on:move={handleMove}>
      {#each slides as slide, i}
        <SplideSlide>
          <TinyPreviewCard previewImage={slide.img} title={slide.title} tags={slide.tags} slug={slide.slug}/>
        </SplideSlide>
      {/each}
    </Splide>
    <div class="opacity-div" />
  </div>
</div>

<style type="text/postcss">
  .container {
    grid-column-start: 2;
    grid-column-end: span col4-start;
  }
  .content {
    position: relative;
    line-height: 40px;
    color: #6C767D;
    background-color: #F9F9F9;
    box-shadow: inset 0px 2px 12px rgba(0, 0, 0, 0.05);
    border-radius: 40px 0px 0px 40px;
    padding-top: 0.5rem;
    padding-bottom: 2rem;
    padding-left: 1.5rem;
    font-family: 'Montserrat';
    font-weight: 400;
    font-size: 20px;
    font-weight: normal;
    margin-left: -25px;
    width: calc(100vw - 368px);
  }
  .title {
    font-family: 'Montserrat';
  }
  .opacity-div {
    height: 100%;
    width: 15%;
    background: linear-gradient(to right, #f9f9f900, #f9f9f9);
    position: absolute;
    top: 0;
    right: 0;
  }
</style>