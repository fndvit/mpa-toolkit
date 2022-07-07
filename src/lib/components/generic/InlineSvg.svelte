<script lang="ts">
  import * as svgs from '$lib/svg';

  export let svg: keyof typeof svgs;
</script>

<svelte:component this={svgs[svg]}/>
