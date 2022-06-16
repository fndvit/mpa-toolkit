<script lang="ts">
  import EditableText from '../generic/EditableText.svelte';

  export let text: string;
  export let editable = false;
  export let type: 'content' | 'highlight' | 'case-study-first' | 'case-study-second' = 'content';

  let hideScroll = false;
  let showGradient = false;

  let scrollTimeout: number;
  function showScroll() {
    hideScroll = false;
    if (scrollTimeout) window.clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => hideScroll = true, 2000);
  }

  function gradientAction(node: HTMLDivElement) {
    const isScrollable = () => node.scrollHeight > node.clientHeight;
    const isAtBottom = () => Math.round(node.clientHeight + node.scrollTop) >= node.scrollHeight;
    const updateGradient = () => showGradient = isScrollable() && !isAtBottom();
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
  <EditableText bind:value={text} {editable} placeholder='Body text...' />
</div>

<style lang="stylus">

  .content {
    typography: card-body;
    margin-top: 25px;
    overflow: auto;
    min-height: 50px;
    max-height: 170px;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 5px;
    }

    :global(.editable-content) {
      --ui-color-placeholder: #00000044;
    }

  }

  .gradient {
    --gradient-color: $colors.primary-blue;
  }

  .gradient::before {
    content: '';
    position: absolute;
    width: calc((100%) - var(--scrollbar-width) - var(--content-padding) - 28px);
    height: 75%;
    left: inherit;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, var(--gradient-color) 80%);
    transition: all 2s;
    pointer-events: none;
  }

  ::-webkit-scrollbar {
    width: var(--scrollbar-width);
    cursor: pointer;
  }

  ::-webkit-scrollbar-track {
    background: $colors.neutral-bg;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
  }

</style>
