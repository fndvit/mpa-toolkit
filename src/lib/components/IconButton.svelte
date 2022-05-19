<script lang="ts">
  export let active: boolean = false;
  export let disabled: boolean = false;
  export let title: string = null;
  export let icon: string = null;
  export let text: string = null;
  export let href: string = null;
  export let rel: string = null;
  export let target: string = null;
  export let square = false;
</script>

{#if href}
  <a
    class:material-icons={icon}
    class="icon-button"
    class:square
    {href} {rel} {target}
    on:click
    on:mousedown={(e) => e.preventDefault()}
    {disabled}
    class:active
    data-icon={icon}
    data-text={text}
  > </a>
{:else}
  <button
    class:material-icons={icon}
    class="icon-button"
    class:square
    on:click
    on:mousedown={(e) => e.preventDefault()}
    {disabled}
    class:active
    data-icon={icon}
    data-text={text}
  />
{/if}

<style lang="scss">
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

    &:hover {
      text-decoration: none;
      &[data-icon]::before {
        background-color: var(--ib-hover-bg, #33333355);
      }
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
      background-color: var(--ib-icon-bg, #33333355);
      border-radius: 3px;
    }

    &[data-text]::after {
      content: attr(data-text);
      font-family: 'Montserrat';
      font-size: var(--ib-font-size, 1rem);
    }

    &.active {
      background: #eee;
      border: 1px solid #ccc;
    }

    &:not(:disabled) {
      cursor: pointer;
      &:hover {
        &:not(.active) {
          background: var(--ib-hover-bg, transparent);
          border: var(--ib-hover-border, 1px solid transparent);
        }
      }

    }
  }

</style>
