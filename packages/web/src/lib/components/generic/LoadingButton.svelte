<script lang="ts">
  import { Button, Spinner } from '$lib/components/generic';

  export let loading = false;
  export let disabled = false;
</script>

<Button on:click disabled={loading || disabled}>
  <div class="contents">
    {#if loading}
      <Spinner />
    {/if}
    <div class:hidden={loading}>
      <slot />
    </div>
  </div>
</Button>

<style lang="postcss">
  .contents {
    display: flex;
    align-items: center;
    justify-content: center;

    > :global(.spinner) {
      position: absolute;

      --spinner-size: 1.5rem;
      --spinner-thickness: 2px;
      --spinner-color: #333;
    }
  }

  .hidden {
    visibility: hidden;
  }
</style>
