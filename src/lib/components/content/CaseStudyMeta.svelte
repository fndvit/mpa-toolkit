<script lang="ts">
  import type { Options } from '@splidejs/splide';
  import type { CaseStudy } from "$lib/types";
  import GlobeViz from "../GlobeViz.svelte";
  import MilestonesMeta from './MilestonesMeta.svelte';
  import type { Prisma } from "@prisma/client";

  export let caseStudy: CaseStudy;

  const { name, established, size, governance,
    staff, budget, budgetLevel, lat, long } = caseStudy;

  let milestones: {[key: string]: any} = caseStudy.milestones as Prisma.JsonObject;

  const options: Options = {
    type: 'slide',
    perMove: 1,
    gap: '25px',
    autoWidth:true,
    pagination: false,
    arrows: false
  }

</script>

<div class="meta-container">

  <div class="meta-content">

    <div class="meta-grid meta-grid-1">

      <h4>Name</h4>
      <div>{name}</div>

      <h4>Established in</h4>
      <div>{established}</div>

      <h4>Size</h4>
      <div>{size} km²</div>

      <div class="globe-cell">
        <GlobeViz width={245} {lat} {long} />
      </div>

    </div>

    <div class="meta-grid meta-grid-2">

      <h4>Governance</h4>
      <div>{governance}</div>

      <h4>Staff</h4>
      <div>{staff}</div>

      <h4>Budget</h4>
      <div>{budget}</div>

      <h4>Budget level</h4>
      <div>{budgetLevel}</div>

    </div>

  </div>

</div>

{#if milestones.content.length}
  <MilestonesMeta {milestones}/>
{/if}



<style lang="scss">

  .meta-container {
    background: #13487C;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.2);
  }

  .meta-content {
    width: 1300px;
    margin-left: 124px;
    padding: 35px 0;
  }

  .meta-grid {
    display: grid;
    grid-template-rows: auto auto;
    grid-auto-flow: column;
    column-gap: 1.5rem;

    &.meta-grid-1 {
      grid-template-columns: 325px 225px 425px 325px;
      margin-bottom: 40px;
      min-height: 110px;
    }

    &.meta-grid-2 {
      grid-template-columns: 325px 325px 325px 325px;
    }

  }

  .meta-grid > div {
    font-family: 'Bitter';
    color: white;
  }

  .meta-grid-1 > div {
    font-size: 28px;
    line-height: 42px;
  }

  .meta-grid-2 > div {
    font-size: 18px;
    line-height: 32px;
  }

  .meta-grid > h4 {
    font-family: 'Montserrat';
    font-weight: bold;
    color: #F9F9F9;
    font-size: 16px;
    line-height: 24px;
    margin: 0;
  }

  .globe-cell {
    position: relative;
    > :global(.globe) {
      position: absolute;
      transform: translateY(-55%);
    }
  }

</style>