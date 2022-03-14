<script lang="ts">
  import type { InlineBlock } from "$lib/types";
  import Text from "./Text.svelte";
  export let block: InlineBlock;
</script>

{#if block.type === 'text'}<Text {block} />{:else}UNKNOWN BLOCK{/if}