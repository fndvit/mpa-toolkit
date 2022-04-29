<script lang="ts">
  import type { MilestoneBlock } from "$lib/types";

  export let milestones: MilestoneBlock = {year: "2000", content: [{type: "text", text: "Toledo Institute for Development and Environment (TIDE) registered"}, {type: "text", text: "Toledo Institute for Development and Environment (TIDE) registered"}]};
  let containerHeight: number;
  let milestoneHeight: number[] = [];
  const simple = milestones.content.length <= 1;

  let contracted: boolean[] = [];
  for (let m = 0; m < milestones.content.length; m++) {contracted.push(true);}

</script>

<div class="container" bind:clientHeight={containerHeight}>

  <div class="year">{milestones.year}</div>

  <svg height="15" width="15">
    <circle cx="7.5" cy="7.5" r="5" stroke="#FBE26B" stroke-width="3" fill="#096EAE" />
  </svg>

  {#if simple}
    <div class="milestone-text simple">
      {milestones.content[0].text}
    </div>
  {:else}
    <div class="main-thread-line" style="height: {containerHeight - milestoneHeight.at(-1) - 39}px;"/>

    <br><br><br>

    {#each milestones.content as m, i}

      <div class='milestone-container' on:click={() => contracted[i] = !contracted[i]} bind:clientHeight={milestoneHeight[i]}>

        <div class="sub-thread-line">
          <svg width="10" height="4" viewBox="0 0 10 4" fill="none">
            <path class="horizontal-path" d="M1.22933 0.955129V0.955129C2.81493 2.54068 5.01818 3.34773 7.25278 3.1615L9.729 2.95514"/>
          </svg>
        </div>

        <svg class="milestone-circle" height="15" width="15">
          <circle cx="7.5" cy="7.5" r="5" stroke="#FBE26B" stroke-width="3" fill={contracted[i] ? "#096EAE" : "#FBE26B"}/>
        </svg>

        <div class={contracted[i] ? 'milestone-text contracted' : 'milestone-text expanded'}>
          <span>{m.text}</span>
        </div>

      </div>
    {/each}
  {/if}
</div>

<style>

  .simple {
    padding-top: 8px;
    padding-left: 3px;
  }

  .sub-thread-line {
    position: absolute;
    transform: translate(7px, -12px);
  }

  .horizontal-path {
    stroke-dasharray: 3;
    stroke: #FBE26B;
    stroke-width: 1.5px;
  }

  .milestone-container {
    margin-bottom: 40px;
    cursor: pointer;
    width: 200px;
  }

  .milestone-circle {
    transform: translate(17px, -6px);
  }

  .milestone-text {
    max-width: 200px;
    font-size: 16px;
    color: #F9F9F9;
  }

  .expanded {
    padding-left: 22px;
  }

  span{
    font-weight: 500;
    color: #F9F9F9;
  }

  .contracted {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-left: 22px;
    color: #FBE26B;
  }

  .container {
    width: 200px;
    margin-right: 25px;
  }

  .year {
    font-family: 'Montserrat';
    font-size: 12px;
    color: #F9F9F9;
    padding-bottom: 10px;
    padding-left: 4px;
  }

  .main-thread-line {
    position: absolute;
    transform: translateY(-7px);
    border-right: 1.5px dashed #FBE26B;
    padding-left: 6px;
  }

</style>