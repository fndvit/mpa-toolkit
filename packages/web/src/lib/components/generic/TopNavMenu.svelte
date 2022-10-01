<script lang="ts">
  import { slugify } from '@mpa/utils';
  import Hamburger from './Hamburger.svelte';

  export let current = 'Privacy policy';

  const options: string[] = ['Partners', 'Team', 'Privacy policy', 'Terms of use', 'Sitemap'];

  let expanded = false;

  const toggleExpanded = () => (expanded = !expanded);
</script>

<svelte:body on:click={() => (expanded = false)} />

<div class="topnavmenu" on:click|stopPropagation>
  <div class="hamburger-container">
    <Hamburger active={expanded} on:click={toggleExpanded} />
  </div>

  <div class="options-container" class:expanded>
    {#each options as opt}
      <a tabindex="0" on:click={toggleExpanded} class:selected={current === opt} href="/{slugify(opt)}">{opt}</a>
    {/each}
  </div>
</div>

<style lang="stylus">

  .hamburger-container {
    display: none;
    position: absolute;
    right: 2.5rem;
    top: 2.5rem;
    z-index: 100;
  }

  .selected {
    text-shadow: 0px 0px 7px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    box-shadow: 0px 0px 13px rgba(0, 0, 0, 0.05);
  }

  .selected:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }

  .selected::after {
    height: 0px;
  }

  .options-container {
    display: flex;
    gap: 30px;
    justify-content: flex-end;
    z-index: 2;
  }

  a {
    text-decoration: none;
    typography: ui-large-responsive;
    color: #ffffff;
    padding: 0;
    position: relative;
    overflow: hidden;
    padding-left: 20px;
    padding-right: 20px;
  }

  a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #FFFFFF;
    transition: opacity 300ms, transform 300ms;
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  a:hover::after,
  a:focus::after {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  +breakpoint(page, medium) {

    .options-container {
      width: 50vw;
      max-width: 350px;
      flex-direction: column;
      position: absolute;
      top: 0px;
      right: 0px;
      background: $colors.neutral-bg;
      box-shadow: -5px 0px 15px 1px rgba(0, 0, 0, 0.25);
      padding: 3rem;
      padding-left: 1.5rem;
      height: calc(100vh - 5rem);
      justify-content: flex-start;
      position: fixed;
      transform: translateX(100%);
      transition: transform 200ms;
      &.expanded {
        transform: translateX(0%);
      }
    }

    .hamburger-container {
      display: flex;
      justify-content: flex-end;
    }



    a {
      color: #2a2a2a
    }

    .selected {
      color: #2A2A2A;
      typography: h4;
      background-color: $colors.neutral-bg;
      border-radius: none;
      box-shadow: none;
      text-shadow: none;
    }

  }


  +breakpoint(page, small) {

    .hamburger-container {
      transform: scale(0.8);
    }

  }


</style>
