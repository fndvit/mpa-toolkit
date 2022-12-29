<script lang="ts">
  import { page } from '$app/stores';
  import { Toaster } from '$lib/components/generic';
  import Metadata from '$lib/components/metadata/Metadata.svelte';
  import '$lib/styles/app.css';
</script>

{#if !$page.error}
  <Metadata />
{/if}

<slot />

{#if !$page.error}
  <Toaster />
{/if}
