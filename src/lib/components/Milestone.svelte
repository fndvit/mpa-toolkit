<script lang="ts">

  let milestone_1 = {text: 'Toledo Institute for Development and Environment (TIDE) registered', contracted: true };
  let milestone_2 = {text: 'TIDE established TIDE Tours as its initial business venture', contracted: true };
  let milestone_3 = {text: 'Port Honduras Marine Reserve established as IUCN Category IV, which includes protected areas that protect particular species or habitats', contracted: true };
  let milestone_4 = {text: 'A memorandum of understanding for co-management of the MPA signed between the Fisheries Department and TIDE', contracted: true };

  const milestonesArray = [milestone_1, milestone_2, milestone_3, milestone_4];
  let containerHeight: number;
  let milestoneHeight: number[] = [];
  const simpleMilestone = milestonesArray.length <= 1;

</script>

<div class="container" bind:clientHeight={containerHeight}>

  <div class="year">1997</div>

  <svg height="15" width="15">
    <circle cx="7.5" cy="7.5" r="5" stroke="#FBE26B" stroke-width="3" fill="#096EAE" />
  </svg>

  {#if simpleMilestone}
    simpleMilestone
  {:else}
    <div class="dashed-line" style="height: {containerHeight - milestoneHeight.at(-1) - 40}px;"/>
    <br><br><br>

    {#each milestonesArray as m, i}
      <div class='milestone-container' bind:clientHeight={milestoneHeight[i]} on:click={() => m.contracted = !m.contracted}>
        <div class="mini-dashed-line"/>
        <svg class="milestone-circle" height="15" width="15">
          <circle cx="7.5" cy="7.5" r="5" stroke="#FBE26B" stroke-width="3" fill="#096EAE" />
        </svg>
        <div class={m.contracted ? 'milestone-text contracted' : 'milestone-text expanded'}>
          {m.text}
        </div>
      </div>
    {/each}
  {/if}



</div>

<style>

  .milestone-container {
    margin-bottom: 40px;
    cursor: pointer;
  }

  .milestone-circle {
    transform: translate(20px, -6px);
  }

  .milestone-text {
    width: 200px;
    font-size: 16px;
    color: #F9F9F9;
  }

  .expanded {
    padding-left: 30px;
  }

  .contracted {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-left: 30px;
  }

  .mini-dashed-line {
    position: absolute;
    width: 15px;
    border-top: 1.5px dashed #FBE26B;
    transform: translateX(8px);
  }

  .container {
    transform: translateY(-39px);
    width: 200px;
  }

  .year {
    font-family: 'Montserrat';
    font-size: 12px;
    color: #F9F9F9;
    padding-bottom: 10px;
    padding-left: 4px;
  }

  .dashed-line {
    position: absolute;
    transform: translateY(-7px);
    border-right: 1.5px dashed #FBE26B;
    padding-left: 6px;
  }
</style>