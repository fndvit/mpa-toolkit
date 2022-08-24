<script lang="ts">
  import type { PageData } from './$types';
  import { createEmptyPage } from '$lib/helpers/content';
  import PageEditor from '$lib/components/page/PageEditor.svelte';

  export let data: PageData;

  const page = createEmptyPage('chapter');
</script>

<PageEditor {page} {...data} />
