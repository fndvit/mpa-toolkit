<script lang="ts" context="module">

  export const IMAGE_CONFIG = {
      regular: [
        { width: [600, 1000], minWidth: 1250 },
        { width: [840, 1200], minWidth: 820 },
        { width: [600, 1000] }
      ],
      full: [
        { width: [1000, 1500], minWidth: 1250 },
        { width: [840, 1200], minWidth: 820 },
        { width: [600, 1000] }
      ]
    } satisfies Record<string, PictureSource[]>;

</script>

<script lang="ts">
  import type { ImageBlock } from '@mpa/db';
  import imagePlaceholder from '$lib/assets/image-placeholder.svg';
  import type { PictureSource } from '../../generic/PictureSources.svelte';
  import Picture from '$lib/components/generic/Picture.svelte';

  export let block: ImageBlock;

  let loading = false;

  $: style = loading ? `padding-bottom: ${100 / 1.286}%; background-image: url(${imagePlaceholder});` : '';
</script>

<figure class="image image-{block.attrs.style || 'regular'}" class:image--loading={loading} {style}>
  {#if loading}
    <div class="spinner" />
  {/if}

  <Picture
    src={block.attrs.src}
    fallback={imagePlaceholder}
    alt={block.attrs.alt}
    title={block.attrs.title}
    config={IMAGE_CONFIG[block.attrs.style || 'regular']}
  />

  {#if block?.attrs?.credits}
    <div class="image-credits">
      Credits: {block.attrs.credits}
    </div>
  {/if}
</figure>

<style lang="postcss">
  .image :global(img) {
    width: 100%;
  }

  .image {
    position: relative;
    font-size: 0;
    margin: 0;
  }

  .image-full {
    margin-left: calc(-1 * var(--img-full-breakout-l, 200px));
    margin-right: calc(-1 * var(--img-full-breakout-r, 200px));

    @mixin breakpoint content, medium {
      margin: 0;
    }
  }

  .image-credits {
    font: $f-ui;
    background-color: #ffffff95;
    padding: 5px;
    border-radius: 10px;
    position: absolute;
    bottom: 8px;
    right: 8px;
  }

  :global(.img-placeholder),
  .image--loading {
    display: block;
    padding-bottom: calc(150% / 1.93); /* placeholder img is 193x150 */
    background-size: cover;
    position: relative;

    :global(.spinner) {
      --spinner-size: 70px;
      --spinner-thickness: 6px;
      --spinner-color: #0008;

      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: auto;
      height: auto;
      background: #fff5;
    }
  }
</style>
