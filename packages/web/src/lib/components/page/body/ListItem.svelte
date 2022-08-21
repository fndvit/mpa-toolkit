<script lang="ts">
  import type { ListItemBlock } from '@mpa/db';
  import { Block } from '$lib/components';

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
