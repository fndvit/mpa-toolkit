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

<style lang="postcss">
  ol {
    > :global(li) {
      @mixin font-responsive p;

      padding-left: 10px;
    }
  }
</style>
