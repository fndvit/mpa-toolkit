<script lang="ts">
  import type { CaseStudy } from "$lib/types";
  import GlobeViz from "../GlobeViz.svelte";
  import Milestone from "../Milestone.svelte";

  export let caseStudy: CaseStudy;

  const { name, established, size, governance,
    staff, budget, budgetLevel, lat, long } = caseStudy;

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

  <div class="milestones-grid">
    <Milestone/>
  </div>
</div>

<style lang="scss">

  .milestones-grid {
    margin-left: 345px;
    max-width: 1300px;
  }

  .milestones-title {
    font-size: 20px;
    font-weight: bold;
    color: #FFFFFF;
    padding-top: 25px;
    margin-bottom: 35px;
    margin-left: 345px;
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
    margin-left: 350px;
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