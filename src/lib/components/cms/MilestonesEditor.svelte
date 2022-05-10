<script lang="ts">
  import type { Milestones } from "$lib/types";

  export let milestones: Milestones = {};
  export let disabled: boolean = false;

  let milestoneYear: number;
  let milestoneText: string;

  const onClickSaveMilestone = () => {
    const _yearStr = milestoneYear.toString();
    milestones = { ...milestones, [_yearStr]: milestones[_yearStr] || [] };
    milestones[_yearStr].push(milestoneText);
    milestoneText = '';
    milestones = milestones;
  }

  const onClickDeleteMilestone = (year: string, milestoneIndex: number) => {
    milestones[year].splice(milestoneIndex, 1);
    if (milestones[year].length === 0) {
      delete milestones[year];
    }
    milestones = milestones;
  }

</script>

<div>

  <div class="title">Milestones</div>

  <div class="container">
    <div class="edit-area">
      <input type="number" bind:value={milestoneYear} {disabled} placeholder="Year" class="year-selector"/>
      <textarea type="text" bind:value={milestoneText} rows="4" {disabled} placeholder="Milestone text" class="milestone-area"/>
      <button disabled={!milestoneYear || !milestoneText} on:click={onClickSaveMilestone}>Save milestone</button>
    </div>

    <div class="list">
      {#each Object.keys(milestones).sort() as year}
        <ul>
          {year}
          {#each milestones[year] as str, i}
          <li>
            <div class="list-item">
              {str}
              <button on:click={() => onClickDeleteMilestone(year, i)}>&times;</button>
            </div>
          </li>
          {/each}
        </ul>
      {/each}
    </div>

  </div>

</div>



<style lang="scss">

  button:disabled {
    opacity: 0.65;
    display: block;
  }

  .container {
    margin-left: 150px;
  }

  .title {
    margin-bottom: 15px;
  }

  .milestone-area {
    width: 50rem;
    margin-bottom: 15px;
  }

  .year-selector {
    width: 5rem;
    margin-bottom: 15px;
  }

  .list {
    display: inline-block !important;
    width: 100rem;

    button {
      float: right;
      border: none;
      background: transparent;
      padding: 0;
      margin: 0;
      color: #dc4f21;
      font-size: 25px;
      font-weight: 400;
      cursor: pointer;
    }
  }

  .list-item {
    list-style: none;
    padding: 10px 10px;
    border-bottom: 1px solid #ddd;
  }

  ul {
    padding-left: 0px;
  }

  li {
    margin-left: 15px;
  }

</style>