<script lang="ts">
  import '@splidejs/splide/dist/css/splide.min.css';
  import {Splide, SplideSlide} from "@splidejs/svelte-splide";
  import type { Options } from '@splidejs/splide';
  import Milestone from "../Milestone.svelte";

  export let milestones: {[key: string]: any};

  let splide: Splide;

  const options: Options = {
    perMove: 1,
    gap: '25px',
    pagination: false,
    perPage: 6,
    arrows: true,
    breakpoints: {
      1600: {
        perPage: 5,
      },
      1400: {
        perPage: 4,
      },
      1200: {
        perPage: 3,
      },
      1000: {
        perPage: 2,
      },
      800: {
        perPage: 1,
      }
    }
  }

  const onClickNextSwipe = () => {
    splide.go('>');
  }

  const onClickPrevSwipe = () => {
    splide.go('<');
  }

  const handleMove = (newIndex: number) => {
    console.log(newIndex);
    console.log(splide);
  }

</script>


<div class="meta-milestones">
  <div class="milestones-title">Milestones</div>

  <svg class="svg">
    <line class="svg-line" x1="0" y1="50%" x2="100%" y2="50%"/>
  </svg>

  <div class="milestones-slider">
    <Splide {options} bind:this={splide} on:move={(e) => handleMove(e.detail.index)}>
      {#each milestones.content as m}
        <SplideSlide>
          <Milestone milestone={m}/>
        </SplideSlide>
      {/each}
    </Splide>
  </div>

</div>


<style lang="scss">


  :global(button:disabled){
    display: none;
  }

  :global(.splide__arrow--prev){
    transform: translateX(-4rem);
  }

  :global(.splide__arrow--next){
    transform: translateX(4rem);
  }

  .next { right: 3rem; }

  .prev { left: 3rem; }

  .milestones-slider {
    transform: translateY(-39px);
    margin-left: 124px;
    margin-right: 250px;
  }

  .milestones-title {
    font-size: 20px;
    font-weight: bold;
    color: #FFFFFF;
    padding-top: 25px;
    margin-bottom: 35px;
    margin-left: 124px;
  }

  .svg-line {
    stroke:#FBE26B;
    stroke-width:3;
  }

  .svg {
    height:5px;
    width:100%;
    margin-top: 15px;
  }

  .meta-milestones {
    background: #04558E;
    box-shadow: inset 0px 0px 16px rgba(0, 0, 0, 0.15);
    position: relative;
  }

</style>