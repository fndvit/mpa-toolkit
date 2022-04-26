<script lang="ts">
  import type { CardBodyBlock } from '$lib/types';

  export let block: CardBodyBlock;

  let isScrollingEnd: boolean = false;
  let isScrolling: boolean = false;
  let hasScroll: boolean = false;
  let contentDiv: HTMLElement;

  let parseScroll: svelte.JSX.MouseEventHandler<HTMLDivElement> = () => {
    isScrolling = contentDiv.scrollTop > 0;

    isScrollingEnd = Math.round(contentDiv.scrollHeight - contentDiv.scrollTop) <= contentDiv.clientHeight;
  };

  $: if(contentDiv) hasScroll = contentDiv.scrollHeight > contentDiv.clientHeight;
</script>

{#if block.content}
  <div bind:this={contentDiv} class:hide-scrollbar={!isScrolling} class="content" on:scroll={parseScroll}>
    <div class="scrollbar-content" class:bottom-gradient-fadeout={!isScrollingEnd && hasScroll}>
      {#each block.content as textBlock}
        {textBlock.text}
      {/each}
    </div>
  </div>
{/if}

<style>
  .content {
    margin-top: 25px;
    font-size: 22px;
    overflow: auto;
    min-height: 50px;
    max-height: 170px;
    visibility: visible;
    font-family: var(--font-serif);
  }
  .content:hover {
    visibility: visible;
  }
  .hide-scrollbar::-webkit-scrollbar-thumb {
    background: transparent;
  }
  .hide-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .bottom-gradient-fadeout::before {
    content: '';
    width: calc((100%) - var(--scrollbarWidth) - var(--contentPadding));
    height: 75%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: linear-gradient(180deg, rgba(251, 226, 107, 0) 50%, rgba(251, 226, 107, 1) 80%);
    transition: all 2s;
  }
  ::-webkit-scrollbar {
    width: var(--scrollbarWidth);
    cursor: pointer;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
  }
  .scrollbar-content {
    visibility: visible;
  }
</style>
