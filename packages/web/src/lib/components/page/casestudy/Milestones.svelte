<script lang="ts">
  import type { MilestonesData } from '@mpa/db';
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import { IconButton, Milestone } from '$lib/components';
  import { SplideOptions } from '$lib/helpers/splide';

  export let milestones: MilestonesData;
  export let editable = false;

  const options = SplideOptions({
    perMove: 1,
    pagination: false,
    perPage: 5,
    gap: '20px',
    arrows: true,
    breakpoints: {
      1250: { perPage: 3 },
      820: { perPage: 2 }
    }
  });

  let splide: Splide;

  function onClickAddYear() {
    milestones[''] = [''];
    window.setTimeout(() => splide.go(0));
  }

  function onSaveYear(oldYear: string, newYear: string) {
    if (oldYear !== newYear) {
      const existing = milestones[newYear] || [];
      milestones[newYear] = [...existing, ...milestones[oldYear]];
      delete milestones[oldYear];
      milestones = milestones;
    }
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
      <line x1="0" y1="50%" x2="100%" y2="50%" />
    </svg>

    <Splide {options} bind:this={splide}>
      {#each Object.keys(milestones).sort() as year (year)}
        <SplideSlide>
          <Milestone
            {year}
            {editable}
            bind:content={milestones[year]}
            on:saveYear={({ detail }) => onSaveYear(year, detail)}
            on:delete={() => onDeleteYear(year)}
          />
        </SplideSlide>
      {/each}
    </Splide>
  </div>
</div>

<style lang="stylus">

  .milestones {
    padding-bottom: 40px;

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

  .svg-line {
    position: absolute;
    left: 0;
    height: 3px;
    width: 100vw;
    transform: translateY(30px);
    line {
      stroke:$colors.highlight-1;
      stroke-width:3;
    }
  }

  .milestones-title {
    typography: h4-graphic;
    display: flex;
    column-gap: 20px;
    align-items: center;
    color: #FFFFFF;
    padding-top: 25px;
    padding-bottom: 15px;
    :global(.icon-button) {
      --ib-color: #ffffffee;
      --ib-hover-bg: #00000011;
      --ib-size: 1.5rem;
    }
  }

  +breakpoint(page, medium) {

    .milestones {

      :global(.splide__arrow--prev){
        top: 0rem;
        left: auto;
        right: 55px;
        transform: translateY(-50px) scale(0.80) !important;
      }

      :global(.splide__arrow--next){
        top: 0rem;
        left: auto;
        right: 0rem;
        transform: translateY(-50px) scale(0.80) !important;
      }

      :global(.splide__arrow:disabled){
        display:flex;
        pointer-events: none;
        opacity: 0.3;
      }
    }

  }

  +breakpoint(page, small) {

    .milestones {

      :global(.splide__arrow--prev){
        right: 45px;
        transform: translateY(-50px) scale(0.65) !important;
      }
      :global(.splide__arrow--next){
        transform: translateY(-50px) scale(0.65) !important;
      }
    }

  }

</style>
