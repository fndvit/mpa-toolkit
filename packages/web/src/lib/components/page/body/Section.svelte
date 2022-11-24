<script lang="ts">
  import type { Section, CollapseBlock } from '@mpa/db';
  import ExpandButton from './ExpandButton.svelte';
  export let section: Section;

  let expanded = false;

  const totalBlocks = section.blocks.length - 1;
  const index = section.blocks.findIndex((_, i) => (i > 0 && i < totalBlocks && section.blocks[i].type === 'collapse'));
  let showmore = index !== -1 ? (section.blocks[index] as CollapseBlock).attrs.showmore : '';

</script>

<section
  class:collapsed={!expanded}
  class="content-section"
  id={section.id}
>
  <slot />
  {#if index !== -1}
    <div class="expand-button-collapsed">
      <ExpandButton content={showmore} {expanded} on:click={() => (expanded = !expanded)} />
    </div>
  {/if}
</section>

<style lang="stylus">

  .collapsed > :global(.collapse-point ~ *:not(.expand-button-collapsed)) {
    display: none;
  }

</style>
