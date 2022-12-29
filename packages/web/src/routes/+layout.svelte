<script lang="ts">
  import { Toaster } from '$lib/components/generic';
  import Metadata from '$lib/components/metadata/Metadata.svelte';
  import '$lib/styles/app.css';
</script>

<Metadata />

<slot />

<Toaster />
