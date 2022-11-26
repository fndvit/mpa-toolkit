<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let active = false;
  export let progress = false;

  const dispatch = createEventDispatcher<{ progressAnimationFinished: null }>();
</script>

<div class="dot" class:active class:progress on:click>
  <div class="dot-progressbar" on:animationend={() => dispatch('progressAnimationFinished')} />
  <div class="dot-background" />
</div>

<style lang="postcss">
  .dot {
    position: relative;
    border-radius: var(--dot-size, 7px);
    overflow: hidden;
    transition: opacity 100ms ease, height 100ms ease, flex 100ms ease;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    flex: 0 0 var(--dot-size, 7px);
    height: var(--dot-size, 7px);

    @keyframes dot-progressbar-animation {
      from {
        width: 0;
      }

      to {
        width: 100%;
      }
    }

    &.progress.active {
      flex: 0 1 200px;
      cursor: default;

      .dot-progressbar {
        animation: var(--dot-progress-duration, 10s) dot-progressbar-animation 0s linear;
      }
    }
  }

  .dot-progressbar {
    position: absolute;
    background-color: var(--dot-color, black);
    height: var(--dot-size, 7px);

    .dot:not(.progress.active) & {
      display: none;
    }
  }

  .dot-background {
    background-color: var(--dot-color, black);
    opacity: var(--dot-fade, 0.25);
    width: 100%;
    height: 100%;

    .dot.active:not(.progress) & {
      opacity: 1;
    }

    .dot:hover:not(.active) & {
      opacity: 0.5;
    }
  }
</style>
