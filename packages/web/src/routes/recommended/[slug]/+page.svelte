<script lang="ts">
  import type { PageData } from './$types';
  import CollectionPage from '$lib/components/collection/CollectionPage.svelte';

  export let data: PageData;

  const { pages } = data;
</script>

<CollectionPage {pages} title={'Recommended for you'} tagType={'USER'} />
