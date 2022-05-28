<script lang="ts">
  import type { HeadingBlock } from "$lib/types";
  import Inline from "./Inline.svelte";

  export let block: HeadingBlock;
</script>
<h1>
  {#each block.content as child}<Inline block={child}/>{/each}
</h1>

<style lang="scss">
  h1 {
    font-size: 2.5rem;
  }

  @media screen and (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
  }
</style>