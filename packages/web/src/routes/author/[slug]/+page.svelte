<script lang="ts">
  import type { PageData } from './$types';
  import CollectionPage from '$lib/components/collection/CollectionPage.svelte';

  export let data: PageData;
</script>

<CollectionPage {...data} />
