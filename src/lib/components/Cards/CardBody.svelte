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

<style lang="stylus">

  .content {
    typography: summary-card-body;
    margin-top: 15px;
    overflow: auto;
    min-height: 50px;
    max-height: 170px;

    :global(.no-heading) & {
      margin-top: 0px;
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
      --ui-color-placeholder: #00000044;
    }

  }

  .gradient {
    --gradient-color: $colors.highlight-1;
  }

  .gradient::before {
    content: '';
    position: absolute;
    width: calc((100%) - calc(var(--content-padding) * 2) - var(--scrollbar-width)); //Content Padding Less Scrollbar 5px Width from &::-webkit-scrollbar
    height: 76%;
    left: inherit;
    z-index: 10;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, var(--gradient-color) 80%);
    transition: all 2s;
    pointer-events: none;
  }

  //Does it has some efect?  all next 3 css blocks/* ALX */
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
