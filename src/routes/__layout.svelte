<script lang="ts">
  import '../app.css';
  import '$lib/styles/typography/global.scss';
  import Toaster from '$lib/components/generic/Toaster.svelte';
  import { onMount, setContext } from 'svelte';

  let addToastMessage: Toaster['$$prop_def']['addMessage'];

  const proxy: typeof addToastMessage = (...args) => addToastMessage(...args);
  setContext('addToastMessage', proxy);
  // onMount(async () => {
  // });

</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,600;0,700;1,400;1,700&display=swap"
    rel="stylesheet"
  />
  <link href="https://fonts.googleapis.com/css2?family=Bitter&display=swap" rel="stylesheet">
</svelte:head>

<slot />

<Toaster bind:addMessage={addToastMessage} />