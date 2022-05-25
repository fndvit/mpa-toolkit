<script lang="ts">
  import { onMount } from "svelte";

  export let editable = false;
  export let value: number;
  export let unitSuffix: string = null;
  export let placeholder: number = null;

  const placeholderStr = placeholder && placeholder.toString();

  let el: HTMLInputElement;

  let hiddenEl: HTMLElement;
  let numberInputWidth: number;

  const resizeInput = () => {
    hiddenEl.textContent = el.value || placeholderStr || '';
    numberInputWidth = hiddenEl.getBoundingClientRect().width;
  };

  if (editable) {
    onMount(resizeInput);
  }

</script>

{#if editable}
  <div class="editable-content editable-number">
    <div class="sizer" class:hidden={!!numberInputWidth} bind:this={hiddenEl}>{value || placeholderStr}</div>
    <input
      class="hide-controls"
      class:hidden={!numberInputWidth}
      type="number"
      style="width: {numberInputWidth}px"
      bind:value={value}
      bind:this={el}
      on:input={resizeInput}
      placeholder={placeholderStr}
    />
    {#if unitSuffix}
      <div class="editable-content unit">{unitSuffix}</div>
    {/if}
  </div>
{:else}
    <div class="editable-content">{value || ''} {unitSuffix || ''}</div>
{/if}

<style lang="scss">
  input {
    caret-color: white;
    color: inherit;
    background-color: inherit;
    border: none;
    font-size: inherit;
    color: inherit;
    background-color: transparent;
    padding: 0;
    line-height: inherit;

    &::placeholder {
      color: var(--ui-color-placeholder, #ffffff44);
    }
  }

  .editable-number {
    display: flex;
  }

  .sizer {
    min-width: 50px;
    visibility: hidden;
  }

  .hidden {
    position: absolute;
    width: fit-content;
  }

  .unit {
    margin-left: 6px;
  }

</style>