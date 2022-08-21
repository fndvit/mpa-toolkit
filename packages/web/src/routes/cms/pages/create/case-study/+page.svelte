<script lang="ts">
  import type { PageData } from './$types';
  import { PageEditor } from '$lib/components';
  import { createEmptyPage } from '$lib/helpers/content';

  export let data: PageData;

  const page = createEmptyPage('caseStudy');
</script>

<PageEditor {page} {...data} />
