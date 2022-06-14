<script lang="ts">
  import type { ParagraphBlock } from "$lib/types";
  import Inline from "./Inline.svelte";

  export let block: ParagraphBlock;

</script>

<p>
  {#each (block.content || []) as child}<Inline block={child}/>{/each}
</p>

<style lang="stylus">
  p {
    typography: p-responsive;
  }
</style>