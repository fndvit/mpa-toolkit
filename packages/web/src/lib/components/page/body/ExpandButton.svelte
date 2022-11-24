<script lang="ts">
  import ExpandButtonBase from './ExpandButtonBase.svelte';

  export let content: string;
  export let expanded: boolean;
  export let collapsePoint: boolean = undefined;

</script>

<!-- Render a hidden element to be able to know the original position of the ExpandButton -->
{#if collapsePoint}
  <div class="collapse-point"/>
{:else}
  <ExpandButtonBase {expanded} on:click>
    {#if !expanded}
      {#if content}
        {@html content}
      {:else}
        <p><span class="unlabeled">Show more on this topic</span></p>
      {/if}
    {:else}
      Read less
    {/if}
  </ExpandButtonBase>
{/if}

<style lang="stylus">
  .unlabeled {
    color: #bbb;
  }

  .collapse-point {
    display: none;
  }
</style>
