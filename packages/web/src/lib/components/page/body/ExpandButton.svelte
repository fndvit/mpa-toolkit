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
      <p><span>Show more on this topic</span></p>
    {/if}
  {:else}
    Read less
  {/if}
</ExpandButtonBase>
