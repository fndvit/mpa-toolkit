<script lang="ts">
  export let active: boolean = false;
  export let disabled: boolean = false;
  export let icon: string = null;
  export let text: string = null;
</script>

<button
  class:material-icons={icon}
  class="icon-button"
  on:click
  on:mousedown={(e) => e.preventDefault()}
  {disabled}
  class:active
  data-icon={icon}
  data-text={text}
/>

<style lang="scss">
  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 5px;
    background: var(--icon-button-bg, transparent);
    text-align: center;
    color: var(--icon-color, #333);
    border: 1px solid transparent;
    box-sizing: border-box;
    padding: 0;
    border-radius: 3px;

    &[data-text] {
      padding: 0 10px 0 0;
    }

    &[data-icon]::before {
      content: attr(data-icon);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Material Icons';
      font-size: var(--icon-size, 1rem);
      width: var(--size, 2rem);
      height: var(--size, 2rem);
      background-color: var(--icon-bg, #33333355);
      border-radius: 3px;
    }
    &:hover[data-icon]::before {
      background-color: var(--icon-hover-bg, #33333355);
    }

    &[data-text]::after {
      content: attr(data-text);
      font-family: 'Montserrat';
      font-size: var(--font-size, 0.8rem);
    }

    &.active {
      background: #eee;
      border: 1px solid #ccc;
    }

    &:not(:disabled) {
      cursor: pointer;
      &:hover {
        &:not(.active) {
          background: var(--hover-bg, transparent);
          border: var(--hover-border, 1px solid transparent);
        }
      }

    }
  }

</style>
