<script lang="ts">
  import MetadataIndexed from './MetadataIndexed.svelte';
  import MetadataUnindexed from './MetadataUnindexed.svelte';
  import { page } from '$app/stores';
  import type { PageMetadata } from '$lib/metadata';

  $: metadata = $page.data.metadata as PageMetadata | null;
  $: if (metadata === null) {
    console.warn('Missing metadata for this route:', $page.route.id);
  } else if (metadata === undefined) {
    console.warn('Need to manually load dynamic metadata for route:', $page.route.id);
  }
</script>

{#if !metadata}
  <div class="metadata-warning">Missing metadata for this route: <span>{$page.route.id}</span></div>
{:else if 'indexed' in metadata && metadata.indexed === false}
  <MetadataUnindexed {metadata} />
{:else if (metadata.indexed ?? true) === true}
  <MetadataIndexed {metadata} />
{/if}

<style lang="postcss">
  .metadata-warning {
    background: #ff8585;
    padding: 10px;
    text-align: center;
    font: $f-ui-small;

    > span {
      margin-left: 5px;
      font-size: 13px;
    }
  }
</style>
