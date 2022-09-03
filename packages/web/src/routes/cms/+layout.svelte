<script>
  import { closeModal, Modals } from 'svelte-modals';
  import UnindexedMetadata from '$lib/components/generic/UnindexedMetadata.svelte';
  import { page } from '$app/stores';
  import { getPageDisplayTitle } from '$lib/helpers/content';

  const { data } = $page;

  const titles = {
    'cms': 'CMS', // prettier-ignore
    'cms/login': 'Login',
    'cms/pages': 'CMS - Pages',
    'cms/tags': 'CMS - Tags',
    'cms/users': 'CMS - Users',
    'cms/authors': 'CMS - Authors',
    'cms/homepage': 'CMS - Homepage',
    'cms/pages/[id]': 'page' in data ? `Edit page - ${getPageDisplayTitle(data.page)}` : 'Edit page'
  };

  $: title = titles[$page.routeId] || 'CMS';
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
</svelte:head>

<UnindexedMetadata {title} />

<slot />

<Modals>
  <div slot="backdrop" class="backdrop" on:click={closeModal} />
</Modals>

<style lang="stylus">
  .backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0,0,0,0.50)
  }

  :global(.material-icons) {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px; /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
  }

</style>
