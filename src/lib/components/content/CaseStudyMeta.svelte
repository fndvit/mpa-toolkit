<script lang="ts">
  import '@splidejs/splide/dist/css/splide.min.css';
  import {Splide, SplideSlide} from "@splidejs/svelte-splide";
  import type { Options } from '@splidejs/splide';
  import type { CaseStudy, MilestoneBlock } from "$lib/types";
  import GlobeViz from "../GlobeViz.svelte";
  import Milestone from "../Milestone.svelte";

  export let caseStudy: CaseStudy;

  const { name, established, size, governance,
    staff, budget, budgetLevel, lat, long } = caseStudy;

  const options: Options = {
    type: 'slide',
    perMove: 1,
    gap: '25px',
    autoWidth:true,
    pagination: false,
    arrows: false
  }

  let m1: MilestoneBlock = {year: "1997", content: [
    {type: "text", text: "Toledo Institute for Development and Environment (TIDE) registered"},
    {type: "text", text: "TIDE established TIDE Tours as its initial business venture"},
    {type: "text", text: "Port Honduras Marine Reserve established as IUCN Category IV, which includes protected areas that protect particular species or habitats"},
    {type: "text", text: "A memorandum of understanding for co-management of the MPA signed between the Fisheries Department and TIDE"}
  ]};

  let m2: MilestoneBlock = {year: "1999", content: [
    {type: "text", text: "TIDE established TIDE Tours as its initial business venture"},
    {type: "text", text: "Port Honduras Marine Reserve established as IUCN Category IV, which includes protected areas that protect particular species or habitats"},
    {type: "text", text: "A memorandum of understanding for co-management of the MPA signed between the Fisheries Department and TIDE"}
  ]};

  let m3: MilestoneBlock = {year: "2001", content: [
    {type: "text", text: "TIDE established TIDE Tours as its initial business venture"},
    {type: "text", text: "A memorandum of understanding for co-management of the MPA signed between the Fisheries Department and TIDE"}
  ]};

  let m4: MilestoneBlock = {year: "2008", content: [
    {type: "text", text: "A memorandum of understanding for co-management of the MPA signed between the Fisheries Department and TIDE"}
  ]};


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

<div class="meta-milestones">
  <div class="milestones-title">Milestones</div>

  <svg class="svg">
    <line class="svg-line" x1="0" y1="50%" x2="100%" y2="50%"/>
  </svg>

  <div class="milestones-slider">
    <Splide {options}>
      <SplideSlide>
        <Milestone milestones={m1}/>
      </SplideSlide>
      <SplideSlide>
        <Milestone milestones={m2}/>
      </SplideSlide>
      <SplideSlide>
        <Milestone milestones={m3}/>
      </SplideSlide>
      <SplideSlide>
        <Milestone milestones={m4}/>
      </SplideSlide>
      <SplideSlide>
        <Milestone milestones={m2}/>
      </SplideSlide>
      <SplideSlide>
        <Milestone milestones={m1}/>
      </SplideSlide>
      <SplideSlide>
        <Milestone milestones={m4}/>
      </SplideSlide>
      <SplideSlide>
        <Milestone milestones={m1}/>
      </SplideSlide>
      <SplideSlide>
        <Milestone milestones={m2}/>
      </SplideSlide>
      <SplideSlide>
        <Milestone milestones={m3}/>
      </SplideSlide>
    </Splide>
  </div>

</div>

<style lang="scss">

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
  }

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