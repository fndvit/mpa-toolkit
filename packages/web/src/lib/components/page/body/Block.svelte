<script lang="ts">
  import type { ContentBlock } from '@mpa/db';
  import Heading from './Heading.svelte';
  import Paragraph from './Paragraph.svelte';
  import Image from './Image.svelte';
  import TextSlider from './TextSlider.svelte';
  import BulletList from './BulletList.svelte';
  import OrderedList from './OrderedList.svelte';
  import DiagramComponent from './DiagramComponent.svelte';
  import LinkSlider from './LinkSlider.svelte';
  import CollapsePointBlock from './CollapsePointBlock.svelte';

  export let block: ContentBlock;

  const components = {
    heading: Heading,
    paragraph: Paragraph,
    cards: TextSlider,
    linkcards: LinkSlider,
    image: Image,
    bullet_list: BulletList,
    ordered_list: OrderedList,
    diagram: DiagramComponent,
    collapse: CollapsePointBlock
  };
</script>

{#if components[block.type]}
  <svelte:component this={components[block.type]} {block} />
{:else}
  <div class="unknown-block">
    Unknown block type: {block.type}
  </div>
{/if}

<style lang="postcss">
  .unknown-block {
    background: $c-error-red;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem -1rem;
  }
</style>
