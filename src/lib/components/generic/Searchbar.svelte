<script lang="ts">
  export let type: 'inline'|'collection'|'top';

  let search: string;
  const submit = () => {search ? alert(search) : alert("invalid search");};

</script>


<div class="searchbar" class:top={type==='top'} class:inline={type==='inline'} class:collection={type==='collection'}>
  <input class="input-text" bind:value={search} spellcheck="false"/>
  {#if !search}
    {#if type === 'top'}
      <div class="placeholder">Try <b>asking us</b> anything</div>
    {:else}
      <div class="placeholder">Or, looking for <b>something else?</b></div>
    {/if}
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

    .top & {
      stroke:#FFFFFF;
    }

    .collection & {
      stroke:#FFFFFF;
    }
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
    justify-content: space-between;

    &.top {
      width: 290px;
      padding: 0px 25px;
    }

    &.collection {
      background: rgba(9, 110, 174, 0.5);
    }
  }

  .placeholder {
    color: #000000;
    position: absolute;
    transform: translateY(10px);
    pointer-events: none;

    .top & {
      color:#FFFFFF;
    }

    .collection & {
      color:#FFFFFF;
    }

  }

  .search-icon {
    stroke-width: 1.5;
    width: 24px;
    height: 24px;
    fill: none;
    float: right;
    transform: translateY(3.5px);
    cursor: pointer;
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

    .top & {
      color:#FFFFFF;
    }

    .collection & {
      color:#FFFFFF;
    }

  }

  @media(max-width: 1024px) {

    .searchbar.top {
      padding: 5px 25px;
      width: fit-content;
    }

    .search-icon {
      display: flex;
    }

  }

  @media(max-width: 414px) {

    .searchbar.top {
      padding: 0px 15px;
      width: fit-content;
    }

    .searchbar {
      border-radius: 70px;
    }

    .placeholder {
      .top & {
        display: none;
      }

      .inline & {
        font-size: 14px;
        transform: translateY(12px);
      }

      .collection & {
        font-size: 14px;
        transform: translateY(12px);
      }
    }

  }

</style>