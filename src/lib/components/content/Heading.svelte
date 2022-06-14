<script lang="ts">
  import type { HeadingBlock } from "$lib/types";
  import Inline from "./Inline.svelte";

  export let block: HeadingBlock;
</script>
<h2>
  {#each block.content as child}<Inline block={child}/>{/each}
</h2>

<style lang="stylus">
  h2 {
    typography: h2-responsive;
  }
</style>
