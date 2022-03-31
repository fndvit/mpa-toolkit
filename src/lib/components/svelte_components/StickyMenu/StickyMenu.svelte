<script lang="ts">
  import { onMount } from 'svelte';
  import MenuSpy from './menuspy';
  import type { MenuSpyParams } from './menuspy';
  import * as animateScroll from 'svelte-scrollto';
  import { parseTextToID } from '$lib/helpers';

  export let menuOptions: { text: string }[] = [];

  let nav: HTMLElement;
  let ms: MenuSpy;
  let msParams: MenuSpyParams = {
    menuItemSelector: '[href^="#"]',
    activeClass: 'active',
    threshold: 150,
    enableLocationHash: true,
    hashTimeout: 0,
    callback: null
  };

  let scrollToFunction = (option: { text: string }, index: number) => {
    animateScroll.scrollTo({
      element: `#${parseTextToID(option.text)}`,

      onStart: () => {
        ms.activateItem(ms.scrollItems[index]);
        ms.dissableUpdate();
      },
      onDone: () => {
        ms.enableUpdate();
      }
    });
  };

  onMount(() => {
    ms = new MenuSpy(nav, msParams);
  });
</script>

<nav class="mainnav" bind:this={nav}>
  {#each menuOptions as option, i}
    <div
      class="menuoption {i === 0 ? 'active' : ''}"
      on:click={() => scrollToFunction(option, i)}
    >
      <div href="#{parseTextToID(option.text)}">
        {option.text}
      </div>
    </div>
  {/each}
</nav>

<style>
  .mainnav {
    width: 215px;
    z-index: 10;
    background: #f9f9f9;
    box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 20px 20px;
    padding-top: 31px;
    padding-bottom: 29px;
  }
  .menuoption {
    margin: 10px 40px 0px 28px;
    font-family: 'Montserrat';
    font-size: 12px;
    font-weight: 300;
    line-height: 18px;
    cursor: pointer;
  }
  .active {
    font-weight: 700;
  }
</style>
