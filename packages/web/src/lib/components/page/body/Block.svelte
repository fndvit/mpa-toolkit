<script lang="ts">
  import type { ContentBlock } from '@mpa/db';
  import { BulletList, Heading, Image, OrderedList, Paragraph, TextSlider } from '$lib/components';

  export let block: ContentBlock;

  const components = {
    heading: Heading,
    paragraph: Paragraph,
    cards: TextSlider,
    image: Image,
    bullet_list: BulletList,
    ordered_list: OrderedList
  };
</script>

{#if components[block.type]}
  <svelte:component this={components[block.type]} {block} />
{:else}
  <div class="unknown-block">
    Unknown block type: {block.type}
  </div>
{/if}

<style lang="stylus">
  .unknown-block {
    background: $colors.error-red;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem -1rem;
  }
</style>
