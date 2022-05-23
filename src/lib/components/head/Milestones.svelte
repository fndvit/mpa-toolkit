<script lang="ts">
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import Milestone from "$lib/components/Milestone.svelte";
  import type { MilestonesData } from '$lib/types';
  import { SplideOptions } from '$lib/helpers/splide';
  import IconButton from "$lib/components/generic/IconButton.svelte";

  export let milestones: MilestonesData;
  export let editable = false;

  const options = SplideOptions({
    perMove: 1,
    gap: '25px',
    pagination: false,
    perPage: 6,
    arrows: true,
    breakpoints: {
      1600: { perPage: 5 },
      1400: { perPage: 4 },
      1200: { perPage: 3 },
      1000: { perPage: 2 }
    }
  });

  let splide: Splide;

  function onClickAddYear() {
    milestones[''] = [''];
    window.setTimeout(() => splide.go(0));
  }

  function onSaveYear(oldYear: string, newYear: string) {
    const existing = milestones[newYear] || [];
    milestones[newYear] = [...existing, ...milestones[oldYear]];
    delete milestones[oldYear];
    milestones = milestones;
  }

  function onDeleteYear(year: string) {
    delete milestones[year];
    milestones = milestones;
  }

</script>


<div class="milestones">

  <div class="milestones-content">

    <div class="milestones-title">
      Milestones
      {#if editable}
        <IconButton on:click={onClickAddYear} icon="add" text="Add year" />
      {/if}
    </div>

    <svg class="svg-line">
      <line x1="0" y1="50%" x2="100%" y2="50%"/>
    </svg>

    <Splide {options} bind:this={splide}>
      {#each Object.keys(milestones).sort() as year, i (year)}
        <SplideSlide>
          <Milestone
            {year}
            {editable}
            bind:content={milestones[year]}
            on:saveYear={({detail}) => onSaveYear(year, detail)}
            on:delete={() => onDeleteYear(year)}
          />
        </SplideSlide>
      {/each}
    </Splide>

  </div>

</div>


<style lang="scss">

  .milestones {
    --width: auto;
    --margin: 120px;

    padding-bottom: 40px;

    background: #04558E;
    box-shadow: inset 0px 0px 16px rgba(0, 0, 0, 0.15);
    position: relative;

    :global(.splide__arrow:disabled){
      display: none;
    }

    :global(.splide__arrow--prev){
      transform: translateX(-5rem) scale(0.8);
    }

    :global(.splide__arrow--next){
      transform: translateX(5rem) scale(0.8);
    }
    &:not(:hover) .milestones-title :global(.icon-button) {
      visibility: hidden;
    }
  }

  .milestones-title {
    display: flex;
    column-gap: 20px;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    color: #FFFFFF;
    padding-top: 25px;
    padding-bottom: 15px;
    :global(.icon-button) {
      --ib-color: #ffffffee;
      --ib-hover-bg: #00000011;
      --ib-size: 1.5rem;
    }
  }

  .svg-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 3px;
    width: 100%;
    transform: translateY(30px);

    line {
      stroke:#FBE26B;
      stroke-width:3;
    }
  }

  .milestones-content {
    width: var(--width);
    margin: 0 var(--margin);
  }


  //Responsive CSS

  @media screen and (max-width: 768px) {
    .milestones {
      margin: 0px;
      padding: 0px 20px 30px 20px;
      max-width: 100%;
      overflow-x: hidden;
    }

    .milestones-content {
      margin: 0px;
    }

    :global(.splide__arrow--prev){
      top: 0rem;
      left: auto;
      right: 45px;
      transform: translateY(-50px) scale(0.65) !important;
    }

    :global(.splide__arrow--next){
      top: 0rem;
      left: auto;
      right: 0rem;
      transform: translateY(-50px) scale(0.65) !important;
    }
  }

</style>