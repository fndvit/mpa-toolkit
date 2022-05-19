<script lang="ts">
  export let active: boolean = false;
  export let disabled: boolean = false;
  export let icon: string = null;
  export let text: string = null;
  export let title: string = null;
</script>

<button
  class:material-icons={icon}
  data-title={title}
  on:click
  on:mousedown={(e) => e.preventDefault()}
  {disabled}
  class:active
  data-icon={icon}
>
  {icon || text}
</button>

<style lang="scss">
  button {
    --bg-color: transparent;
    --color: #333;
    --hover-border-color: #f1f1f1;
    --hover-bg: var(--bg-color);
    --size: 2rem;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size);
    height: var(--size);
    cursor: pointer;
    background: var(--bg-color);
    text-align: center;
    color: var(--color);
    border: 1px solid transparent;
    box-sizing: border-box;;
    border-radius: 3px;
    font-size: 0.75rem;


    &.material-icons {
      font-size: 1rem;
    }

    &.active {
      background: #eee;
      border: 1px solid #ccc;
    }

    &[data-title]::before {
      content: attr(data-title);
      font-family: 'Montserrat';
      z-index: 100000;
      position: absolute;
      font-size: 14px;
      top: calc(100% + 5px);
      padding: 5px 6px;
      color: #333;
      background: #ffffffee;
      border: 1px solid #00000011;
      border-radius: 5px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }

    &:hover {
      filter: brightness(95%);
      &:not(.active) {
        background: var(--hover-bg);
        border: 1px solid var(--hover-border-color);
      }
      &[data-title]::before {
        opacity: 1;
        transition: opacity 0.2s ease 0.5s;
      }
    }
  }

</style>
