<script lang="ts">
  export let disabled = false;
  export let cls = '';
  export let href: string = null;
  export let rel: string = undefined;
  export let target: string = undefined;
</script>

{#if href}
  <a class="button {cls}" on:click {disabled} {href} {rel} {target}>
    <slot />
  </a>
{:else}
  <button class="button {cls}" on:click {disabled}>
    <slot />
  </button>
{/if}

<style lang="postcss">
  .button {
    font: $f-p-graphic;
    position: relative;
    color: #333;
    background-color: #efefef;
    border: 1px solid #bbb;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2em;
    padding: 0 15px;
    cursor: pointer;

    &:hover {
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
