<script lang="ts">
  export let disabled = false;
</script>

<button class="button" on:click {disabled}>
  <slot />
</button>

<style lang="scss">

  .button {
    --bg-color: #efefef;
    --color: #333;
    --border-color: #bbb;
    --height: 2em;

    position: relative;
    color: var(--color);
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
