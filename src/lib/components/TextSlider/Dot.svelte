<script lang="ts">
  import { createEventDispatcher, afterUpdate } from 'svelte';

  export let active: boolean = false;
  export let progress: boolean = false;
  export let color: string = '#2D2B2F';

  let animatonCurrentDot: Animation;
  let progressBar: HTMLElement;

  const dispatch = createEventDispatcher();

  afterUpdate(() => {
    if (progress && active) {
      animatonCurrentDot = progressBar.animate(
        [
          // keyframes
          { width: '8px' },
          { width: '100%' }
        ],
        {
          // timing options
          duration: 10000,
          iterations: 1
        }
      );
      animatonCurrentDot.onfinish = function (e) {
        if (active) dispatch('progressAnimationFinished');
      };
    }
  });
  $: if (!active && animatonCurrentDot !== undefined) animatonCurrentDot.cancel();
</script>

{#if active && progress}
  <div class="progress-container" style="background-color: {color}80;">
    <div class="progress-bar" style="background-color: {color}; display: block" on:click bind:this={progressBar} />
  </div>
{:else}
  <div class="dot" class:active style="background-color: {color};" on:click />
{/if}

<style>
  .dot {
    --dot-size: 10px;
    border-radius: 50%;
    display: inline-block;
    opacity: 0.5;
    transition: opacity 100ms ease, height 100ms ease, width 100ms ease;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    height: var(--dot-size);
    width: var(--dot-size);
  }
  .progress-bar {
    display: block;
    border-radius: 10px;
    width: 8px;
    height: 10px;
    cursor: pointer;
  }
  .progress-container {
    display: inline-block;
    width: 200px;
    height: 10px;
    border-radius: 10px;
    cursor: pointer;
  }
  .dot:hover {
    opacity: 0.9;
  }
  .active {
    opacity: 0.7;
    border-radius: 10px;
    height: calc(var(--dot-size) + 2px);
    width: calc(var(--dot-size) + 2px);
  }
</style>
