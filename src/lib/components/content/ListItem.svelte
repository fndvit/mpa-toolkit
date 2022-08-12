<script lang="ts">
  import type { ListItemBlock } from '$lib/types';
  import Block from './Block.svelte';

  export let block: ListItemBlock;

</script>

<li>
  {#each block.content as block}
    <Block {block} />
  {/each}
</li>

<style lang="stylus">
  // p {
  //   typography: p-responsive;
  // }
</style>
