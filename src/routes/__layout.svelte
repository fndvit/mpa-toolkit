<script lang="ts">
  import '$lib/styles/app.styl';
  import Toaster from '$lib/components/generic/Toaster.svelte';
  import { setContext } from 'svelte';

  let addToastMessage: Toaster['$$prop_def']['addMessage'];

  const proxy: typeof addToastMessage = (...args) => addToastMessage(...args);
  setContext('addToastMessage', proxy);
</script>

<slot />

<Toaster bind:addMessage={addToastMessage} />