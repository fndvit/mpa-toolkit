<script lang="ts">
  import { EditableText } from '$lib/components/generic';

  export let text: string;
  export let editable = false;

  let hideScroll = false;
  let showGradient = false;

  let scrollTimeout: number;
  function showScroll() {
    hideScroll = false;
    if (scrollTimeout) window.clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => (hideScroll = true), 2000);
  }

  function gradientAction(node: HTMLDivElement) {
    const isScrollable = () => node.scrollHeight > node.clientHeight;
    const isAtBottom = () => Math.round(node.clientHeight + node.scrollTop) >= node.scrollHeight;
    const updateGradient = () => (showGradient = isScrollable() && !isAtBottom());
    node.addEventListener('scroll', updateGradient);
    window.setTimeout(() => updateGradient());
  }
</script>

<div
  class="content"
  class:hide-scrollbar={hideScroll}
  class:gradient={showGradient}
  on:mouseenter={showScroll}
  use:gradientAction
  on:scroll={showScroll}
>
  <EditableText bind:value={text} {editable} placeholder="Body text..." />
</div>

<style lang="postcss">
  .content {
    margin-top: 15px;
    overflow: auto;
    min-height: 50px;
    max-height: 170px;

    @mixin font-responsive summary-card-body;

    :global(.body-column) &,
    :global(.editor-content) & {
      @mixin font-responsive content-card-body;
    }

    :global(.no-heading) & {
      margin-top: 0;
    }

    &::-webkit-scrollbar {
      width: var(--scrollbar-width);
    }

    &::-webkit-scrollbar-track {
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 5px;
    }

    :global(.editable-content) {
      --editable-placeholder-color: #0004;
    }
  }

  .gradient {
    --gradient-color: $c-highlight-1;
  }

  .gradient::before {
    content: '';
    position: absolute;
    width: calc((100%) - var(--content-padding) - var(--content-right-padding) - var(--scrollbar-width));
    height: 76%;
    left: inherit;
    z-index: 10;
    background: linear-gradient(180deg, rgb(0 0 0 / 0%) 50%, var(--gradient-color) 95%);
    transition: all 2s;
    pointer-events: none;
  }
</style>
