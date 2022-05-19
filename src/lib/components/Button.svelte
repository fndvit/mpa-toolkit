<script lang="ts">
  export let disabled = false;
  export let cls: string = '';
  export let href: string = null;
  export let rel: string = undefined;
</script>

{#if href}
<a class="button {cls}" on:click {disabled} {href} {rel}>
  <slot />
</a>
{:else}
<button class="button {cls}" on:click {disabled}>
  <slot />
</button>
{/if}

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

    &:hover{
      text-decoration: none;
      &:not(:disabled) {
        filter: brightness(95%);
      }
    }

    &:disabled {
      cursor: default;
      color: #aaa;
    }
  }

</style>
