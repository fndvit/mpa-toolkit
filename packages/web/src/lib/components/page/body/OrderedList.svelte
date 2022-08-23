<script lang="ts">
  import type { BulletListBlock } from '@mpa/db';
  import ListItem from './ListItem.svelte';
  export let block: BulletListBlock;
</script>

<ol>
  {#each block.content as block}
    <ListItem {block} />
  {/each}
</ol>

<style lang="stylus">
  ol {
    > :global(li) {
      typography: p-responsive;
      padding-left: 10px;
    }
  }
</style>
