<script lang="ts">
  import type { PageData } from './$types';
  import { PageEditor } from '$lib/components';

  export let data: PageData;
</script>

<PageEditor {...data} />
