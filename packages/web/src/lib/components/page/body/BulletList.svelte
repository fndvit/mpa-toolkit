<script lang="ts">
  import type { BulletListBlock } from '@mpa/db';
  import ListItem from './ListItem.svelte';

  export let block: BulletListBlock;
</script>

<ul>
  {#each block.content as block}
    <ListItem {block} />
  {/each}
</ul>

<style lang="postcss">
  ul {
    > :global(li) {
      @mixin font-responsive p;

      padding-left: 5px;
    }
  }
</style>
