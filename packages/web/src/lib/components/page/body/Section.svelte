<script lang="ts">
  import type { Section, CollapseBlock } from '@mpa/db';
  import { tick } from 'svelte';
  import ExpandButton from './ExpandButton.svelte';
  export let section: Section;

  let expanded = false;

  const collapseBlock = section.blocks.find(block => block.type === 'collapse') as CollapseBlock;

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
  {#if collapseBlock}
    <div class="expand-button-collapsed">
      <ExpandButton content={collapseBlock.attrs.showmore} {expanded} on:click={onClickExpand} />
    </div>
  {/if}
</section>

<style lang="postcss">
  .collapsed > :global(.collapse-point ~ *:not(.expand-button-collapsed)) {
    display: none;
  }
</style>
