<script lang="ts">
  export let milestone:  {[key: string]: any};
  const simple = milestone.content.length <= 1;

  let containerHeight: number;
  let milestoneHeight: number[] = [];

  let contracted = new Array(milestone.content.length).fill(true);
</script>

<div class="container" bind:clientHeight={containerHeight}>

  <div class="year">{milestone.year}</div>

  <svg height="15" width="15">
    <circle cx="7.5" cy="7.5" r="5" stroke="#FBE26B" stroke-width="3" fill="#096EAE" />
  </svg>

  {#if simple}

    <div class="milestone-text simple">
      {milestone.content[0].text}
    </div>

  {:else}

    <div class="main-thread-line" style="height: {containerHeight - milestoneHeight.at(-1) - 39}px;"/>

    <div class="milestones-block">

      {#each milestone.content as m, i}
        <div class='milestone-container' on:click={() => contracted[i] = !contracted[i]} bind:clientHeight={milestoneHeight[i]}>
          <div class="sub-thread-line">
            <svg width="10" height="4" viewBox="0 0 10 4" fill="none">
              <path class="horizontal-path" d="M1.22933 0.955129V0.955129C2.81493 2.54068 5.01818 3.34773 7.25278 3.1615L9.729 2.95514"/>
            </svg>
          </div>
          {#if contracted[i]}
            <svg class="milestone-circle-2" width="17" height="17" viewBox="0 0 17 17" fill="none">
              <circle cx="8.5" cy="8.5" r="5" fill="#096EAE" stroke="#FBE26B" stroke-width="3"/>
              <line x1="14" y1="0.5" x2="17" y2="0.5" stroke="#FBE26B"/>
              <line x1="16.5" y1="3" x2="16.5" y2="1" stroke="#FBE26B"/>
              <line x1="3" y1="16.5" x2="4.37114e-08" y2="16.5" stroke="#FBE26B"/>
              <line x1="0.5" y1="14" x2="0.5" y2="16" stroke="#FBE26B"/>
            </svg>
          {:else}
            <svg class="milestone-circle" height="15" width="15">
              <circle cx="7.5" cy="7.5" r="5" stroke="#FBE26B" stroke-width="3" fill={contracted[i] ? "#096EAE" : "#FBE26B"}/>
            </svg>
          {/if}

          <div class={contracted[i] ? 'milestone-text contracted' : 'milestone-text expanded'}>
            <span>{m.text}</span>
          </div>

        </div>
      {/each}

    </div>

  {/if}
</div>

<style>

  .milestones-block {
    margin-top: 25px;
  }

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

  .milestone-circle-2 {
    transform: translate(16px, -7px);
  }

  .milestone-text {
    max-width: 200px;
    font-size: 16px;
    color: #F9F9F9;
  }

  .expanded {
    padding-top: 1.5px;
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