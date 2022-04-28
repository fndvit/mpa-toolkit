<script lang="ts">
  let milestone_1 = {text: 'Toledo Institute for Development and Environment (TIDE) registered', contracted: true };
  let milestone_2 = {text: 'TIDE established TIDE Tours as its initial business venture', contracted: true };
  let milestone_3 = {text: 'Port Honduras Marine Reserve established as IUCN Category IV, which includes protected areas that protect particular species or habitats', contracted: true };
  let milestone_4 = {text: 'A memorandum of understanding for co-management of the MPA signed between the Fisheries Department and TIDE', contracted: true };

  let milestonesArray = [milestone_1, milestone_2, milestone_3, milestone_4];
  let containerHeight: number;
  let milestoneHeight: number[] = [];
  milestonesArray = [milestone_1];
  const simpleMilestone = milestonesArray.length <= 1;

</script>

<div class="container" bind:clientHeight={containerHeight}>

  <div class="year">1997</div>

  <svg height="15" width="15">
    <circle cx="7.5" cy="7.5" r="5" stroke="#FBE26B" stroke-width="3" fill="#096EAE" />
  </svg>

  {#if simpleMilestone}
    <div class="milestone-text simple">
      {milestone_1.text}
    </div>
  {:else}
    <div class="main-thread-line" style="height: {containerHeight - milestoneHeight.at(-1) - 39}px;"/>

    <br><br><br>

    {#each milestonesArray as m, i}

      <div class='milestone-container' on:click={() => m.contracted = !m.contracted} bind:clientHeight={milestoneHeight[i]}>

        <div class="sub-thread-line">
          <svg width="10" height="4" viewBox="0 0 10 4" fill="none">
            <path class="horizontal-path" d="M1.22933 0.955129V0.955129C2.81493 2.54068 5.01818 3.34773 7.25278 3.1615L9.729 2.95514"/>
          </svg>
        </div>

        <svg class="milestone-circle" height="15" width="15">
          <circle cx="7.5" cy="7.5" r="5" stroke="#FBE26B" stroke-width="3" fill={m.contracted ? "#096EAE" : "#FBE26B"}/>
        </svg>

        <div class={m.contracted ? 'milestone-text contracted' : 'milestone-text expanded'}>
          {m.text}
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
    transform: translate(20px, -6px);
  }

  .milestone-text {
    max-width: 200px;
    font-size: 16px;
    color: #F9F9F9;
  }

  .expanded {
    font-weight: bold;
    padding-left: 30px;
  }

  .contracted {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-left: 30px;
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