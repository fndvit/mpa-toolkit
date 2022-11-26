<script lang="ts">
  import { onMount } from 'svelte';
  import * as animateScroll from 'svelte-scrollto';
  import MenuSpy, { type MenuSpyParams } from './StickyMenu';

  export let menuOptions: { id: string; title: string }[] = [];

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

  onMount(() => (ms = new MenuSpy(nav, msParams)));
</script>

<nav class="sticky-menu" bind:this={nav}>
  {#each menuOptions as { id, title }, i}
    <div class="menuoption" class:active={i === 0} on:click={() => scrollToFunction(id, i)}>
      <div href="#{id}">
        {title}
      </div>
    </div>
  {/each}
</nav>

<style lang="postcss">
  .sticky-menu {
    background: $c-neutral-bg;
    box-shadow: 0 1px 16px rgb(0 0 0 / 10%);
    border-radius: 0 0 20px 20px;
    padding-top: 31px;
    padding-bottom: 29px;
    max-height: 70vh;
    overflow-y: none;
    width: 189px;
  }

  .menuoption {
    font: $f-ui-small;
    padding: 10px 30px 0;
    cursor: pointer;

    &:hover:not(.active) {
      font-weight: 500;
      letter-spacing: -0.005em;
    }
  }

  .active {
    font-weight: 700;
  }
</style>
