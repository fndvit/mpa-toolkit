<script lang="ts">
  import type { PageData } from './$types';
  import Page from '$lib/components/page/Page.svelte';
  import UnindexedMetadata from '$lib/components/generic/UnindexedMetadata.svelte';
  import { getPageDisplayTitle } from '$lib/helpers/content';

  export let data: PageData;
</script>

<UnindexedMetadata title="[DRAFT] {getPageDisplayTitle(data.page)}" />
<Page {...data} />
