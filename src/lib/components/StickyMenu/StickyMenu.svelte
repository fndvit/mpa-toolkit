<script lang="ts">
  import { onMount } from 'svelte';
  import MenuSpy from './menuspy';
  import type { MenuSpyParams } from './menuspy';
  import * as animateScroll from 'svelte-scrollto';

  export let menuOptions: { id: string, title: string }[] = [];

  let nav: HTMLElement;
  let ms: MenuSpy;
  let msParams: MenuSpyParams = {
    menuItemSelector: '[href^="#"]',
    activeClass: 'active',
    threshold: 150,
    enableLocationHash: false,
    hashTimeout: 0,
    callback: null
  };

  let scrollToFunction = (id: string, index: number) => {
    animateScroll.scrollTo({
      element: `#${id}`,

      onStart: () => {
        ms.activateItem(ms.scrollItems[index]);
        ms.dissableUpdate();
      },
      onDone: () => ms.enableUpdate()
    });
  };

  onMount(() => ms = new MenuSpy(nav, msParams));

</script>

<nav class="sticky-menu" bind:this={nav}>
  {#each menuOptions as {id, title}, i}
    <div
      class="menuoption"
      class:active={i === 0}
      on:click={() => scrollToFunction(id, i)}
    >
      <div href="#{id}">
        {title}
      </div>
    </div>
  {/each}
</nav>

<style lang="stylus">
  .sticky-menu {
    z-index: 10;
    background: $colors.neutral-bg;
    box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 20px 20px;
    padding-top: 31px;
    padding-bottom: 29px;
    max-height: 70vh;
    overflow-y: scroll;
  }
  .menuoption {
    typography: ui-small;
    margin: 10px 40px 0px 28px;
    cursor: pointer;
  }
  .active {
    font-weight: 700;
  }


</style>
