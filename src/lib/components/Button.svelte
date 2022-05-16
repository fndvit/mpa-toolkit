<script lang="ts">
  export let disabled = false;
  type Style = 'primary' | 'secondary';
  export let style: Style = 'primary';
</script>

<button class={style} on:click {disabled}>
  <slot />
</button>

<style lang="scss">

  button.primary {
    --bg-color: #efefef;
    --border-color: #bbb;
  }
  button.secondary {
    --bg-color: #e37777;
    --border-color: #cb6666;
  }
  button {
    --height: 2em;
    position: relative;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--height);
    padding: 0 15px;
    cursor: pointer;
    &:hover {
      filter: brightness(95%);
    }
  }

</style>
