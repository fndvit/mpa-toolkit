<script lang="ts">
  import type { UnindexedPageMetadata } from '$lib/metadata';

  export let metadata: UnindexedPageMetadata;
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
  <title>{metadata.title}</title>
</svelte:head>
