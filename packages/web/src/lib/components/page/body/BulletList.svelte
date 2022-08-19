<script lang="ts">
  import type { BulletListBlock } from '@mpa/db';
  import { ListItem } from '$lib/components';

  export let block: BulletListBlock;
</script>

<ul>
  {#each block.content as block}
    <ListItem {block} />
  {/each}
</ul>

<style lang="stylus">
  ul {
    > :global(li) {
      typography: p-responsive;
      padding-left: 5px;
    }
  }
</style>
