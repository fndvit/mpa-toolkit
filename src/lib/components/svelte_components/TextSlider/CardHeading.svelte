<script lang="ts">
  import type { CardHeadingBlock } from "$lib/types";

  export let block: CardHeadingBlock;
</script>

{#if block.content}
  <div class="heading">{block.content[0].text}</div>
{/if}

<style>
  .heading {
    margin-top: 5px;
    font-size: 20px;
    font-weight: 700;
  }
</style>
