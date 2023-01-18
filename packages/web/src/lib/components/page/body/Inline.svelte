<script lang="ts">
  import type { InlineBlock } from '@mpa/db';
  import Text from './Text.svelte';
  export let block: InlineBlock;
</script>

{#if block.type === 'text'}<Text {block} />{:else}UNKNOWN BLOCK ({block.type}){/if}
