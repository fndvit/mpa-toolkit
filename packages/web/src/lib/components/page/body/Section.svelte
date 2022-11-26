<script lang="ts">
  import type { Section, CollapseBlock } from '@mpa/db';
  import { tick } from 'svelte';
  import ExpandButton from './ExpandButton.svelte';
  export let section: Section;

  let expanded = false;

  const totalBlocks = section.blocks.length - 1;
  const index = section.blocks.findIndex((_, i) => i > 0 && i < totalBlocks && section.blocks[i].type === 'collapse');
  let showmore = index !== -1 ? (section.blocks[index] as CollapseBlock).attrs.showmore : '';

  const onClickExpand = async (e: Event) => {
    const buttonEl = e.currentTarget as HTMLButtonElement;
    const offsetTop = buttonEl.offsetTop;
    expanded = !expanded;
    if (!expanded) {
      await tick();
      window.scrollBy(0, buttonEl.offsetTop - offsetTop);
    }
  };
</script>

<section class:collapsed={!expanded} class="content-section" id={section.id}>
  <slot />
  {#if index !== -1}
    <div class="expand-button-collapsed">
      <ExpandButton content={showmore} {expanded} on:click={onClickExpand} />
    </div>
  {/if}
</section>

<style lang="postcss">
  .collapsed > :global(.collapse-point ~ *:not(.expand-button-collapsed)) {
    display: none;
  }
</style>
