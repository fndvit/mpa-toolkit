<script lang="ts">
  import type { InlineBlock } from '@mpa/db';
  import { Text } from '$lib/components';
  export let block: InlineBlock;
</script>

{#if block.type === 'text'}<Text {block} />{:else}UNKNOWN BLOCK{/if}
