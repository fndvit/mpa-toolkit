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
>
  {icon || text}
</button>

<style lang="scss">
  .icon-button {
    --bg-color: transparent;
    --color: #333;
    --hover-border-color: #f1f1f1;
    --hover-bg: var(--bg-color);
    --size: 2rem;
    --font-size: 0.75rem;

    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size);
    height: var(--size);
    background: var(--bg-color);
    text-align: center;
    color: var(--color);
    border: 1px solid transparent;
    box-sizing: border-box;;
    border-radius: 3px;


    &.material-icons {
      font-size: var(--font-size);
    }

    &.active {
      background: #eee;
      border: 1px solid #ccc;
    }

    &:not(:disabled) {
      cursor: pointer;
      &:hover {
        &:not(.active) {
          background: var(--hover-bg);
          border: 1px solid var(--hover-border-color);
        }
      }

    }
  }

</style>
