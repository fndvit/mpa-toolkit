<script lang="ts">
  import type { HeadingBlock } from '@mpa/db';

  export var attrs: HeadingBlock['attrs'];
  export var contentDOM: (node: HTMLElement) => void;

  $: tag = `h${attrs.level}`;
  $: sectionHeading = attrs.level === 1;
</script>

<div class="hv" class:section-heading={sectionHeading} >
  <svelte:element this={tag}>
    <div use:contentDOM />
  </svelte:element>
</div>

<style lang="stylus">
  .hv {
    position: relative;
  }

</style>
