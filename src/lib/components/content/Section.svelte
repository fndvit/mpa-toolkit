<script lang="ts">
  import type { Section } from "$lib/types";
  import ExpandButton from "./ExpandButton.svelte";

  export let section: Section;

  let expanded = false;
  const numParagraphs = section.blocks.filter(b => b.type === 'paragraph').length;
</script>

<section class="content-section" id={section.id} class:collapsed={!expanded}>
  <slot/>
  {#if numParagraphs > 2}
    <ExpandButton content={section.topic} {expanded} on:click={() => expanded = !expanded} />
  {/if}
</section>

<style lang="scss">
  .collapsed > :global(h1 ~ p ~ p ~ :not(.expand-button)) {
    display: none;
  }
</style>
