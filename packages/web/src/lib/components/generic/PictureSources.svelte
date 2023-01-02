<script lang="ts" context="module">
  export type SupportedFormats = 'webp' | 'jpeg' | 'png' | 'avif';
  export type PictureSource = {
    minWidth?: number;
    /** @property The width in px, or `[<width1x>, <width2x>]` */
    width?: number | [number, number];
    /** @property The height in px, or `[<height1x>, <height2x>]` */
    height?: number | [number, number];
    quality?: number;
  };
</script>

<script lang="ts">
  import { imageUrl } from '$lib/helpers/content';
  export let config: PictureSource[];
  export let formats: SupportedFormats[] = ['webp', 'jpeg'];
  export let src: string;

  const extract = (dim: number | [number, number], i: 0 | 1) => (Array.isArray(dim) ? dim[i] : dim);
</script>

{#each config as { minWidth, width, height, quality }}
  {#each formats as format}
    <source
      type="image/{format}"
      media={minWidth ? `(min-width: ${minWidth}px)` : ''}
      srcset="
        {imageUrl(src, { format, quality, width: extract(width, 0), height: extract(height, 0) })} 1x,
        {imageUrl(src, { format, quality, width: extract(width, 1), height: extract(height, 1) })} 2x"
    />
  {/each}
{/each}
