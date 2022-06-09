<script lang="ts">
  import { staticUrl } from "$lib/helpers/content";
  import type { ImageBlock } from "$lib/types";

  export let block: ImageBlock;

</script>

<div class="image image-{block.attrs.style || 'regular'}">
  <img src={staticUrl(block.attrs.src)} alt={block.attrs.alt} />
</div>

<style lang="stylus">

  .image-full {
    margin-left: calc(-1 * var(--img-full-breakout-l, 200px));
    margin-right: calc(-1 * var(--img-full-breakout-r, 200px));
  }

  .image img {
    width: 100%;
  }

</style>
