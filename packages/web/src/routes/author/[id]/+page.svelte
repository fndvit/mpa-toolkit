<script lang="ts">
  import type { PageData } from './$types';
  import { CollectionPage } from '$lib/components';

  export let data: PageData;
</script>

<CollectionPage {...data} />
