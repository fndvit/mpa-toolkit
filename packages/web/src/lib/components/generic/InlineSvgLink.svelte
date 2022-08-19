<script lang="ts">
  import { page } from '$app/stores';
  import { InlineSvg } from '$lib/components';
  import type * as svgs from '$lib/svg';

  export let href: string;
  export let svg: keyof typeof svgs;
  export let newTab = false;

  const isExternal = (_href: string) => {
    try {
      const { hostname } = new URL(_href);
      return hostname !== $page.url.hostname;
    } catch (e) {
      return false;
    }
  };

  const props = {
    rel: isExternal(href) ? 'external' : undefined,
    target: newTab ? '_blank' : undefined
  };
</script>

<a {href} {...props}><InlineSvg {svg} /><slot /></a>

<style lang="stylus">
  a
    color: inherit
</style>
