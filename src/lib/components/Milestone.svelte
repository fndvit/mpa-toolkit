<script lang="ts">
  export let milestone:  {[key: string]: any};
  const simple = milestone.content.length <= 1;

  let contracted = new Array(milestone.content.length).fill(true);

</script>

<div class="container">

  <div class="year">{milestone.year}</div>

  <svg class="main-circle" height="15" width="15">
    <circle cx="7.5" cy="7.5" r="5" />
  </svg>

  {#if simple}

    <div class="milestone-text simple">
      {milestone.content[0].text}
    </div>

  {:else}

    <div class="milestones-block">

      {#each milestone.content as m, i}
        <div class='milestone-container' on:click={() => contracted[i] = !contracted[i]} style="--row: {i+1};">

          <svg class="sub-thread-line" width="10" height="4" viewBox="0 0 10 4">
            <path d="M1.22933 0.955129V0.955129C2.81493 2.54068 5.01818 3.34773 7.25278 3.1615L9.729 2.95514"/>
          </svg>

          {#if contracted[i]}
            <svg class="expandable-circle" width="17" height="17" viewBox="0 0 17 17">
              <circle cx="8.5" cy="8.5" r="5"  />
              <line x1="14" y1="0.5" x2="17" y2="0.5" />
              <line x1="16.5" y1="3" x2="16.5" y2="1" />
              <line x1="3" y1="16.5" x2="4.37114e-08" y2="16.5" />
              <line x1="0.5" y1="14" x2="0.5" y2="16" />
            </svg>
          {:else}
            <svg class="milestone-circle" class:expanded={!contracted[i]} height="15" width="15">
              <circle cx="7.5" cy="7.5" r="5"/>
            </svg>
          {/if}

          <div class="milestone-text" class:contracted={contracted[i]}>
            <span>{m.text}</span>
          </div>

        </div>
      {/each}

      <div class="main-line" style="--num-milestones: {milestone.content.length - 1}" />
    </div>
  {/if}
</div>

<style lang="scss">

  .main-circle {
    position: absolute;
    stroke: #FBE26B;
    stroke-width: 3;
    fill: #096EAE;
  }

  .milestones-block {
    display: grid;
  }

  .main-line {
    pointer-events: none;
    border-left: 1.5px dashed #FBE26B;
    grid-column: 1;
    grid-row: 1 / span var(--num-milestones);
    margin-left: 7px;
    margin-top: 5px;
    height: 100%;
    box-sizing: content-box;
    padding-bottom: 34px;
  }

  .sub-thread-line {
    position: absolute;
    margin-left: 7px;

    path {
      stroke-dasharray: 3;
      stroke: #FBE26B;
      stroke-width: 1.5px;
    }
  }

  .milestone-container {
    grid-column: 1;
    grid-row: var(--row);
    padding: 40px 0 0;
    cursor: pointer;
    width: 200px;
  }

  .milestone-circle {
    transform: translate(17px, -6px);
    stroke: #FBE26B;
    stroke-width: 3;
    fill: #096EAE;
    &.expanded {
      fill: #FBE26B;
    }
  }

  .expandable-circle {
    stroke: #FBE26B;
    transform: translate(16px, -7px);

    circle {
      fill: #096EAE;
      stroke-width: 3px;
    }
  }

  .milestone-text {
    max-width: 200px;
    font-size: 16px;
    color: #F9F9F9;
    padding-top: 1.5px;
    padding-left: 22px;

    &.simple {
      padding-top: 28px;
      padding-left: 3px;
    }

    &.contracted {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding-left: 22px;
      color: #FBE26B;
    }

  }

  span {
    font-weight: 500;
    color: #F9F9F9;
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

</style>