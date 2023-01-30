<script lang="ts">
  import { imgLoadingStatus } from '$lib/helpers/utils';
  import PictureSources, { type PictureSource, type SupportedFormats } from './PictureSources.svelte';

  export let config: PictureSource | PictureSource[];
  export let formats: SupportedFormats[] = ['webp', 'jpeg'];
  export let src: string;
  export let fallback: string;
  export let alt = '';
  export let title = '';
  export let className = '';
  export let loading: boolean = undefined;

  let error = false;

  export const setErrorFallbackImage = (node: HTMLImageElement) => {
    const setFallback = () => (error = true);
    node.addEventListener('error', setFallback);
    if (node.complete && node.naturalWidth === 0) setFallback();
    return { destroy: () => node.removeEventListener('error', setFallback) };
  };

  export const loadBindings = (node: HTMLImageElement) => {
    if (loading) return imgLoadingStatus(node, val => (loading = val));
  };

  $: _src = src || fallback;
  $: sources = Array.isArray(config) ? config : [config];
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<picture class={className} data-original-src={src} on:click>
  {#if _src || (fallback && error)}
    <PictureSources config={sources} {formats} src={error ? fallback : _src} />
  {/if}
  <img src={_src} {alt} {title} use:setErrorFallbackImage use:loadBindings />
</picture>
