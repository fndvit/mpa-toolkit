<script lang="ts">
  import ExpandButtonBase from "./ExpandButtonBase.svelte";

  export let content: string;
  export let expanded: boolean;
</script>

<ExpandButtonBase {expanded} on:click>
  {#if !expanded}
    {@html content}
  {:else}
    Read less
  {/if}
</ExpandButtonBase>
