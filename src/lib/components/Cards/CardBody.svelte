<script lang="ts">
  import EditableText from '../generic/EditableText.svelte';

  export let text: string;
  export let editable = false;

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

<style lang="scss">
  .content {
    margin-top: 25px;
    font-size: 22px;
    overflow: auto;
    min-height: 50px;
    max-height: 170px;
    font-family: var(--font-serif);
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

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .gradient::before {
    content: '';
    position: absolute;
    width: calc((100%) - var(--scrollbar-width) - var(--content-padding));
    height: 75%;
    left: 0;
    background: linear-gradient(180deg, rgba(251, 226, 107, 0) 50%, rgba(251, 226, 107, 1) 80%);
    transition: all 2s;
    pointer-events: none;
  }
  ::-webkit-scrollbar {
    width: var(--scrollbar-width);
    cursor: pointer;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
  }
</style>
