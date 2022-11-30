<script lang="ts">
  import type { ImageBlock } from '@mpa/db';
  import { staticUrl } from '$lib/helpers/content';
  import imagePlaceholder from '$lib/assets/image-placeholder.svg';
  import { fallbackImage } from '$lib/helpers/utils';

  export let block: ImageBlock;
</script>

<div class="image image-{block.attrs.style || 'regular'}">
  <img src={staticUrl(block.attrs.src)} use:fallbackImage={imagePlaceholder} alt={block.attrs.alt}/>
  {#if block?.attrs?.credits}
  <div class="image-credits">
    Credits: {block.attrs.credits}
  </div>
  {/if}
</div>

<style lang="postcss">
  .image-full {
    margin-left: calc(-1 * var(--img-full-breakout-l, 200px));
    margin-right: calc(-1 * var(--img-full-breakout-r, 200px));
  }

  .image img {
    width: 100%;
  }

  .image {
    position: relative;
  }
  .image-credits {
    background-color: #FFFFFF95;
    font: $f-ui;
    padding: 5px;
    border-radius: 10px;
    position: absolute;
    bottom: 8px;
    right: 8px;
  }
</style>
