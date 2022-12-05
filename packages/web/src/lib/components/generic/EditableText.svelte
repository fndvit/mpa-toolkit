<script lang="ts">
  import { addFocusClass, textOnlyPaste } from '$lib/helpers/utils';

  export let editable = false;
  export let value: string;
  export let placeholder: string = null;
  export let focused: boolean = undefined;

  let el: HTMLElement;
  const handleContentEditableKeyDown: svelte.JSX.KeyboardEventHandler<HTMLDivElement> = e => {
    if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const range = document.createRange();
      range.selectNodeContents(el);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };
  const handleContentEditableKeyPress: svelte.JSX.KeyboardEventHandler<HTMLDivElement> = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  export const blur = () => el && el.blur();
  export const focus = () => el && el.focus();

  $: if (el && focused != null) focused ? focus() : blur();
</script>

{#if editable}
  <div
    class="editable-content editable-text"
    class:editable-content--editing={editable}
    bind:this={el}
    use:addFocusClass={f => (focused = f)}
    use:textOnlyPaste
    on:keypress
    on:keydown={handleContentEditableKeyDown}
    on:keydown
    on:keypress={handleContentEditableKeyPress}
    on:blur
    contenteditable
    data-placeholder={placeholder}
    bind:textContent={value}
    tabindex="0"
  />
{:else}
  <div class="editable-content editable-text">{value || ''}</div>
{/if}

<style lang="postcss">
  .editable-text {
    color: inherit;
    background-color: var(--editable-bg, inherit);
    caret-color: var(--editable-caret, white);

    &.editable-content--editing:hover,
    &.editable-content--editing:focus {
      background-color: var(--editable-bg-active, var(--editable-bg, inherit));
    }

    &:focus {
      outline: var(--editable-outline, 1px solid #fff8);
    }

    &[data-placeholder] {
      &::before {
        content: attr(data-placeholder);
        color: var(--editable-placeholder-color, #fff4);
        pointer-events: none;
      }

      &:not(:empty)::before {
        display: none !important;
      }
    }
  }
</style>
