<script lang="ts">
  import type { HeadingBlock } from "$lib/types";
  import Inline from "./Inline.svelte";
  import { parseTextToID } from "$lib/helpers";

  export let block: HeadingBlock;
</script>
<div id={parseTextToID(block.content[0].text)}>
  <h1>
    {#each block.content as child}<Inline block={child}/>{/each}
  </h1>
</div>

