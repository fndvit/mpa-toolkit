<script lang="ts">
  import type { ListItemBlock } from '@mpa/db';
  import Block from './Block.svelte';

  export let block: ListItemBlock;
</script>

<li>
  {#each block.content as block}
    <Block {block} />
  {/each}
</li>
