<script lang="ts">
  import type { PageData } from './$types';
  import Page from '$lib/components/page/Page.svelte';
  import { getPageDisplayTitle, staticUrl } from '$lib/helpers/content';
  import Metadata from '$lib/components/generic/Metadata.svelte';

  export let data: PageData;

  let desc = data.page.chapter ? data.page.chapter.summary : data.page.caseStudy.name;
</script>

<Metadata title={getPageDisplayTitle(data.page)} {desc} type="Article" image={staticUrl(data.page.img)} />

<Page {...data} />
