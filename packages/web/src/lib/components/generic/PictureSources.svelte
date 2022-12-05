<script lang="ts" context="module">
  export type SupportedFormats = 'webp' | 'jpeg' | 'png' | 'avif';
  export type PictureSource = {
    minWidth?: number;
    width: number;
    width2x?: number;
    quality?: number;
  };
</script>

<script lang="ts">
  import { imageUrl } from '$lib/helpers/content';
  export let config: PictureSource[];
  export let formats: SupportedFormats[] = ['webp', 'jpeg'];
  export let src: string;
</script>

{#each config as { minWidth, width, width2x, quality }}
  {#each formats as format}
    <source
      type="image/{format}"
      media={minWidth ? `(min-width: ${minWidth}px)` : ''}
      srcset="
        {imageUrl(src, { format, quality, width })} 1x,
        {imageUrl(src, { format, quality, width: width2x })} 2x"
    />
  {/each}
{/each}
