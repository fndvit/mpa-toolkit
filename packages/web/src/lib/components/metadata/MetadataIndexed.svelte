<script lang="ts">
  import type { WebSite, Article, WithContext } from 'schema-dts';
  import { jsonLdTemplate } from '$lib/helpers/utils';
  import { page } from '$app/stores';
  import type { IndexedPageMetadata } from '$lib/metadata';

  export let metadata: IndexedPageMetadata;

  $: slug = $page.url.pathname + $page.url.search;
  $: ({ host, protocol } = $page.url);
  $: baseUrl = `${protocol}//${host}`;
  $: metaUrl = baseUrl + slug;

  function getJsonLd({ title, desc, image, type }: IndexedPageMetadata): WithContext<WebSite | Article> {
    const baseLd: WithContext<WebSite | Article> = {
      '@context': 'https://schema.org',
      '@type': type,
      url: metaUrl,
      name: title,
      publisher: {
        '@type': 'Organization',
        name: 'MPath',
        logo: baseUrl + '/favicon.png'
      },
      description: desc
    };
    return type === 'WebSite' ? baseLd : { ...baseLd, image };
  }

  $: jsonLd = metadata.type ? jsonLdTemplate(getJsonLd(metadata)) : '';
</script>

<svelte:head>
  <link rel="canonical" href={metaUrl} />

  <title>{metadata.title}</title>
  <meta name="title" content={metadata.title} />
  <meta name="description" content={metadata.desc} />

  <meta property="og:type" content={metadata.type} />
  <meta property="og:site_name" content="MPAth" />
  <meta property="og:url" content={metaUrl} />
  <meta property="og:title" content={metadata.title} />
  <meta property="og:description" content={metadata.desc} />
  <meta property="og:image" content={metadata.image} />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={metaUrl} />
  <meta property="twitter:title" content={metadata.title} />
  <meta property="twitter:description" content={metadata.desc} />
  <meta property="twitter:image" content={metadata.image} />

  {@html jsonLd}
</svelte:head>
