<script lang="ts">
  export let keyTakeaways: string[] = [];
  export let disabled = false;
  let currentTakeawayText: string = '';

  const onClickSaveTakeaway = () => {
    if (currentTakeawayText.length > 0){
      keyTakeaways = [...keyTakeaways, currentTakeawayText];
      currentTakeawayText = "";
    }
  };

  const onClickDeleteTakeaway = (index: number) => {
    keyTakeaways.splice(index, 1);
    keyTakeaways = keyTakeaways;
  };

</script>


<div>

  <div class="title">Key takeaways</div>

  <div class="container">
    <textarea type="text" bind:value={currentTakeawayText} {disabled} class="takeaway-area"/>
    <button disabled={!currentTakeawayText} on:click={onClickSaveTakeaway}>Save takeaway</button>
    <div class="list">
      {#each keyTakeaways as k, i}
        <div class = "list-item">
          {k}
          <button on:click={() => onClickDeleteTakeaway(i)}>&times;</button>
        </div>
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

  .takeaway-area {
    width: 50rem;
    margin-bottom: 15px;
  }

  .list {
    margin-top: 15px;
    display: inline-block !important;
    width: 100rem;

    button {
      float: right;
      border: none;
      background: transparent;
      padding: 0;
      margin: 0;
      color: #dc4f21;
      font-size: 23px;
      font-weight: bold;
      cursor: pointer;
    }
  }

  .list-item {
    list-style: none;
    padding: 6px 10px;
    border-bottom: 1px solid #ddd;
  }

</style>