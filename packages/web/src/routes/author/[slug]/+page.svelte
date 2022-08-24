<script lang="ts">
  import type { PageData } from '../../../../.svelte-kit/types/src/routes/author/[slug]/$types';
  import CollectionPage from '$lib/components/collection/CollectionPage.svelte';

  export let data: PageData;
</script>

<CollectionPage {...data} />
