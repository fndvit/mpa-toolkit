<script lang="ts">
  import type { ParagraphBlock } from '@mpa/db';
  import Inline from './Inline.svelte';
  export let block: ParagraphBlock;
</script>

<p>
  {#each block.content || [] as child}<Inline block={child} />{/each}
</p>

<style lang="postcss">
  p {
    @mixin font-responsive p;
  }
</style>
