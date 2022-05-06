<script lang="ts">
  export let active: boolean = false;
  export let disabled: boolean = false;
  export let icon: string = null;
  export let text: string = null;
</script>

<button
  class:material-icons={icon}
  on:click
  on:mousedown={(e) => e.preventDefault()}
  {disabled}
  class:active
>
  {icon || text}
</button>

<style lang="scss">
  button {
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    background: transparent;
    text-align: center;
    color: #333;
    border: 0;
    border-radius: 3px;
    font-size: 0.75rem;

    &.material-icons {
      font-size: 1rem;
    }

    &.active {
      background: #eee;
      border: 1px solid #ccc;
    }

    &:hover {
      filter: brightness(95%);
      &:not(.active) {
        border: 1px solid #f1f1f1;
      }
    }
  }

  .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px; /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
  }

</style>
