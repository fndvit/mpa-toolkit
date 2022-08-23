<script lang="ts">
  import ExpandButtonBase from './ExpandButtonBase.svelte';

  export let content: string;
  export let expanded: boolean;
</script>

<ExpandButtonBase {expanded} on:click>
  {#if !expanded}
    {#if content}
      {@html content}
    {:else}
      <p><span class="unlabeled">Add a label</span></p>
    {/if}
  {:else}
    Read less
  {/if}
</ExpandButtonBase>

<style lang="stylus">
  .unlabeled {
    color: #bbb;
  }
</style>
