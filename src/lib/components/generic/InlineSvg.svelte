<script lang="ts">
  import * as svgs from '$lib/svg';

  export let svg: keyof typeof svgs;
  export let href: string;
</script>


<a {href} target="_blank" rel="external">
    <svelte:component this={svgs[svg]}/>
</a>

<style>

  a {
    color: inherit;
  }

</style>
