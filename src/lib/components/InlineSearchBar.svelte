<script lang="ts">

  let search: string;
  const submit = () => {search ? alert(search) : alert("invalid search")};

</script>


<div class="searchbar">
  <input class="input-text" bind:value={search} spellcheck="false"/>
  {#if !search}
    <div class="placeholder">Or, looking for <b>something else?</b></div>
  {/if}
  <div class="search-icon" on:click={submit}>
    <svg class="search-icon" viewBox="0 0 24 24">
      <path class="search-path" d="M15.5 15.5L19 19" />
      <path class="search-path" d="M5 11C5 14.3137 7.68629 17 11 17C12.6597 17 14.1621 16.3261 15.2483 15.237C16.3308 14.1517 17 12.654 17 11C17 7.68629 14.3137 5 11 5C7.68629 5 5 7.68629 5 11Z"/>
    </svg>
  </div>
</div>


<style lang="scss">

  .search-path {
    stroke:black;
    stroke-width: inherit;
    stroke-linecap:round;
    stroke-linejoin:round;
  }

  .searchbar {
    background: rgba(249, 249, 249, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-sizing: border-box;
    box-shadow: inset 0px 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding: 5px 25px;
    overflow: hidden;
    display: flex;
    width: 766px;
    justify-content: space-between;
  }

  .placeholder {
    color: #000000;
    position: absolute;
    transform: translateY(10px);
    pointer-events: none;
  }

  .search-icon {
    stroke-width: 1.5;
    width: 24px;
    height: 24px;
    fill: none;
    cursor: pointer;
    float: right;
    transform: translateY(3.5px);
  }

  .search-icon :hover {
    stroke-width: 2.25;
  }

  .input-text {
    font-size: 16px;
    color: #000000;
    padding: 10px 0px;
    display: inline-block;
    background: none;
    border: none;
    outline: none;
    margin-bottom: 0px;
    width: 100rem;
  }

</style>