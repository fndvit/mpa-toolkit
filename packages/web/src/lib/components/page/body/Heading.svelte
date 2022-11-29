<script lang="ts">
  import type { HeadingBlock } from '@mpa/db';
  import Inline from './Inline.svelte';
  export let block: HeadingBlock;
  const level = block.attrs.level;

  const cls = `block-h${level}`;
</script>

<svelte:element this={`h${level}`} class={cls}>
  {#each block.content || [] as child}<Inline block={child} />{/each}
</svelte:element>

<style lang="postcss">
  .block-h1 {
    @mixin font-responsive h2;

    margin: 2rem 0;
  }

  .block-h2 {
    @mixin font-responsive h3;

    margin: 2rem 0;
  }

  .block-h3 {
    @mixin font-responsive h4-graphic;

    margin: 2rem 0;
  }
</style>
