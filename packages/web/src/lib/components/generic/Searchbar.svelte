<script lang="ts">
  import { goto } from '$app/navigation';
  export let type: 'inline' | 'collection' | 'top';
  export let placeholder: string = null;
  export let search = '';
  export let submit = () => search && goto('/search?q=' + search);

  let inputEl: HTMLElement;

  export const focus = () => {
    if (inputEl) inputEl.focus();
  };
</script>

<div
  class="searchbar"
  class:top={type === 'top'}
  class:inline={type === 'inline'}
  class:collection={type === 'collection'}
>
  {#if !search}
    <div class="placeholder">
      <span>
        {#if placeholder}
          {placeholder}
        {:else if type === 'top'}
          <b>Search</b> for help
        {:else}
          Or, looking for <b>something else?</b>
        {/if}
      </span>
    </div>
  {/if}

  <input
    class="input-text"
    bind:this={inputEl}
    bind:value={search}
    spellcheck="false"
    on:keypress={({ key }) => key === 'Enter' && submit && submit()}
  />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="search-icon" on:click={submit}>
    <svg class="search-icon" viewBox="0 0 24 24">
      <path class="search-path" d="M15.5 15.5L19 19" />
      <path
        class="search-path"
        d="M5 11C5 14.3137 7.68629 17 11 17C12.6597 17 14.1621 16.3261 15.2483 15.237C16.3308 14.1517 17 12.654 17 11C17 7.68629 14.3137 5 11 5C7.68629 5 5 7.68629 5 11Z"
      />
    </svg>
  </div>
</div>

<style lang="postcss">
  .search-path {
    stroke-width: inherit;
    stroke-linecap: round;
    stroke-linejoin: round;

    .top &,
    .collection & {
      stroke: #fff;
    }

    .inline & {
      stroke: black;
    }
  }

  .searchbar {
    position: relative;

    @mixin font-responsive ui-large;

    background: rgb(249 249 249 / 1%);
    border: 1px solid rgb(255 255 255 / 30%);
    box-sizing: border-box;
    box-shadow: inset 0 2px 8px rgb(0 0 0 / 10%);
    border-radius: 20px;
    padding: 5px 25px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.top {
      font: $f-ui;
      width: 290px;
      padding: 0 25px;
    }

    &.collection {
      background: rgb(9 110 174 / 50%);
    }
  }

  .placeholder {
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    pointer-events: none;
    display: flex;
    align-items: center;

    .top &,
    .collection & {
      color: #fff;
    }

    .inline & {
      color: #000;
    }
  }

  .search-icon {
    stroke-width: 1.5;
    width: 24px;
    height: 24px;
    fill: none;
    cursor: pointer;
    display: flex;
  }

  .search-icon :hover {
    stroke-width: 2.25;
  }

  .input-text {
    padding: 10px 0;
    display: inline-block;
    background: none;
    border: none;
    outline: none;
    margin-bottom: 0;
    width: 100rem;

    .top &,
    .collection & {
      color: #fff;
    }

    .inline & {
      color: #000;
    }
  }

  @mixin breakpoint content, medium {
    .searchbar.top {
      padding: 5px 25px;
      width: fit-content;

      :focus {
        width: 10rem;
        max-width: 10rem;
      }
    }

    .search-icon {
      display: flex;
    }
  }

  @mixin breakpoint content, small {
    .searchbar.top {
      padding: 0 15px;
      width: fit-content;

      :focus {
        width: 7rem;
        max-width: 7rem;
      }
    }

    .searchbar {
      border-radius: 70px;
      padding-bottom: 0;
      padding-top: 0;
    }

    .placeholder {
      .top & {
        display: none;
      }
    }
  }
</style>
