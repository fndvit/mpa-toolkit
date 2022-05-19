<script lang="ts">
  import { onMount } from "svelte";

  export let editable = false;
  export let value: string | number;
  export let unitSuffix: string = null;
  export let placeholder: string | number = null;
  export let type: 'text' | 'number' = 'text';

  const placeholderStr = placeholder && placeholder.toString();

  let el: HTMLInputElement;

  let hiddenEl: HTMLElement;
  let numberInputWidth: number;
  let focused = false;

  const resizeInput = () => {
    hiddenEl.textContent = el.value || placeholderStr || '';
    numberInputWidth = hiddenEl.getBoundingClientRect().width;
  }

  if (editable && type === 'number') {
    onMount(resizeInput);
  }

  const handleContentEditableKeyPress: svelte.JSX.KeyboardEventHandler<HTMLDivElement> = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }

  $: showPlaceholder = editable && placeholder && !value && !focused;

</script>

<div class="editable-content-container" class:show-placeholder={showPlaceholder} class:empty={!value}>
  {#if editable}
    {#if type === 'number'}
      <div class="editable-number">
        <div class="editable-content editable-content--sizer" class:hidden={!!numberInputWidth} bind:this={hiddenEl}>{value || placeholderStr}</div>
        <input
          class="editable-content hide-controls"
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
    {:else if type === 'text' && typeof value === 'string'}
      <div
        class="editable-content"
        contenteditable="true"
        on:keypress={handleContentEditableKeyPress}
        bind:textContent={value}
        data-placeholder={placeholderStr}
        on:blur={() => focused = false}
        on:focus={() => focused = true}
      />
    {/if}

  {:else}
    <div class="editable-content">{value || ''} {unitSuffix || ''}</div>
  {/if}
</div>

<style lang="scss">
  .editable-content {
    caret-color: white;

    .show-placeholder &,
    &::placeholder {
      color: var(--placeholder-color, #ffffff44);
    }

    &[data-placeholder]::before {
      content: attr(data-placeholder);
      color: var(--placeholder-color, #ffffff44);
      display: none;
      pointer-events: none;
      .show-placeholder & {
        display: block;
      }
    }
  }

  .editable-content[type="number"] {
    color: inherit;
    background-color: transparent;
    border: none;
  }
  .editable-number {
    display: flex;
  }
  .hidden {
    visibility: hidden;
    position: absolute;
    width: fit-content;
  }
  .unit {
    margin-left: 6px;
  }
  .editable-content--sizer {
    min-width: 50px;
  }

  input.editable-content:hover,
  .editable-content[contenteditable]:hover {
    background: var(--ec-hover-bg, #ffffff08);
    border-radius: 4px;
  }

</style>