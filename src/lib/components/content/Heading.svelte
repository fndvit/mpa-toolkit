<script lang="ts">
  import type { HeadingBlock } from "$lib/types";
  import Inline from "./Inline.svelte";

  export let block: HeadingBlock;
</script>
<div id={block.content[0].text.replace(/\s/g, '').split('.').join("")}>
  <h1>
    {#each block.content as child}<Inline block={child}/>{/each}
  </h1>
</div>

