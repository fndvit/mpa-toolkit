<script lang="ts">
  export let milestones: {[key: string]: any};
  export let editable: boolean;

  let milestoneYear: number;
  let milestoneText: string;

  const onClickSaveMilestone = () => {
    const yearAlreadyExists = milestones.content.findIndex((m) => m.year === milestoneYear);
    if (yearAlreadyExists !== -1){
      milestones.content[yearAlreadyExists]
        .content.push({type: 'text', text: milestoneText});
    }
    else {
      milestones.content.push({year: milestoneYear, content: [
        {type: 'text', text: milestoneText}
      ]});
    }
    milestoneText = '';
    milestones = milestones;
  }

  const onClickDeleteMilestone = (yearIndex: number, milestoneIndex: number) => {
    milestones.content[yearIndex].content.splice(milestoneIndex, 1);
    if (!milestones.content[yearIndex].content.length) {
      milestones.content.splice(yearIndex, 1);
    }
    milestones = milestones;
  }

</script>

<div>

  <div class="title">Milestones</div>

  <div class="container">
    <div class="edit-area">
      <input type="number" bind:value={milestoneYear} disabled={!editable} placeholder="Year" class="year-selector"/>
      <textarea type="text" bind:value={milestoneText} rows="4" disabled={!editable} placeholder="Milestone text" class="milestone-area"/>
      <button disabled={!milestoneYear || !milestoneText} on:click={onClickSaveMilestone}>Save milestone</button>
    </div>

    <div class="list">
      {#each milestones.content as m, i}
        <ul>
          {m.year}
          {#each m.content as x, y}
          <li>
            <div class="list-item">
              {x.text}
              <button on:click={() => onClickDeleteMilestone(i, y)}>&times;</button>
            </div>
          </li>
          {/each}
        </ul>
      {/each}
    </div>

  </div>

</div>



<style lang="scss">

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