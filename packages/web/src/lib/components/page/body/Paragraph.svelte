<script lang="ts">
  import type { ParagraphBlock } from '@mpa/db';
  import { Inline } from '$lib/components';

  export let block: ParagraphBlock;
</script>

<p>
  {#each block.content || [] as child}<Inline block={child} />{/each}
</p>

<style lang="stylus">
  p {
    typography: p-responsive;
  }
</style>
