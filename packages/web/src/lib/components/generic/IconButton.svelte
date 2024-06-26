<script lang="ts">
  import { Tooltip } from '$lib/components/generic';

  export let active = false;
  export let disabled = false;
  export let title: string = null;
  export let icon: string = null;
  export let text: string = null;
  export let href: string = null;
  export let rel: string = null;
  export let target: string = null;
  export let type: HTMLButtonElement['type'] = 'button';
  export let square = false;
  export let theme: 'toolbar' = undefined;
</script>

<div class="icon-button-container tooltip-hover-el" data-id={icon} data-theme={theme}>
  {#if title}
    <Tooltip text={title} />
  {/if}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <svelte:element
    this={href ? 'a' : 'button'}
    class:material-icons={icon}
    class="icon-button"
    class:square
    {href}
    {rel}
    {target}
    on:click
    on:mousedown|preventDefault
    {disabled}
    class:active
    data-icon={icon}
    data-text={text}
    data-title={title}
    type={href ? undefined : type}
  />
</div>

<style lang="postcss">
  
  .icon-button-container {
    position: relative;

    &[data-theme='toolbar'] {
      --ib-icon-bg: transparent;
      --ib-hover-border: 1px solid #ddd;
      --ib-hover-bg: transparent;
      --ib-active-bg: white;
      --ib-active-border: 1px solid #ccc;
    }
  }

  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 5px;
    background: var(--ib-bg, transparent);
    text-align: center;
    color: var(--ib-color, #333);
    border: 1px solid transparent;
    box-sizing: border-box;
    padding: 0;
    border-radius: 3px;
    height: var(--ib-size, 2rem);
    min-width: var(--ib-size, 2rem);

    &.square {
      width: var(--ib-size, 2rem);
    }

    &[data-icon][data-text] {
      padding: 0 10px 0 0;
    }

    &[data-text]:not([data-icon]) {
      padding: 0 10px;
    }

    &[data-icon]::before {
      content: attr(data-icon);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Material Icons';
      font-size: var(--ib-icon-size, 1rem);
      width: var(--ib-size, 2rem);
      height: var(--ib-size, 2rem);
      background-color: var(--ib-icon-bg, #3335);
      border-radius: 3px;
    }

    &[data-text]::after {
      content: attr(data-text);
      font-family: var(--font-sans-serif);
      font-size: var(--ib-font-size, 1rem);
    }

    &.active {
      background: var(--ib-active-bg);
      border: var(--ib-active-border);
    }

    &:not(:disabled) {
      cursor: pointer;

      &:hover {
        text-decoration: none;

        &:not(.active) {
          color: var(--ib-hover-color, var(--ib-color));
          background: var(--ib-hover-bg, var(--ib-bg));
          border: var(--ib-hover-border, 1px solid transparent);
        }

        &[data-icon]::before {
          filter: var(--ib-hover-filter);
          background-color: var(--ib-hover-icon-bg, var(--ib-icon-bg));
        }
      }
    }

    &:disabled {
      opacity: 0.5;
    }
  }
</style>
