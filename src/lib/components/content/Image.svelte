<script lang="ts">
  import { staticUrl } from "$lib/helpers/content";
  import type { ImageBlock } from "$lib/types";

  export let block: ImageBlock;

</script>

<img src={staticUrl(block.attrs.src)} alt={block.attrs.alt} />
