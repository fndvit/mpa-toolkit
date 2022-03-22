<script lang='ts'>
    import type {CardBodyBlock } from "$lib/types";

    export let block: CardBodyBlock;

    let isScrollingEnd: boolean = false;
    let isScrolling: boolean = false;

    let parseScroll: svelte.JSX.MouseEventHandler<HTMLDivElement> = (e)  => {
        let element = e.currentTarget;

        if(element.scrollTop > 0) isScrolling = true;
        else isScrolling = false;

        if (element.scrollHeight - element.scrollTop === element.clientHeight) isScrollingEnd = true;
        else isScrollingEnd = false;
    }
</script>


{#if block.content}
<div class:hide-scrollbar={!isScrolling} class="content" on:scroll={parseScroll}>
    <div class="scrollbar-content" class:bottom-gradient-fadeout={!isScrollingEnd}>
        {#each block.content as textBlock}
            {textBlock.text}
        {/each}
    </div>
</div>
{/if}

<style>
    .content{
        max-width: 100%;
        font-size: 16px;
        overflow: auto;
        height: 75%;
        visibility: visible;
    }
    .content:hover {
        visibility: visible;
    }
    .hide-scrollbar::-webkit-scrollbar-thumb {
        background: transparent;
    }
    .hide-scrollbar::-webkit-scrollbar-track{
        background: transparent;
    }
    .bottom-gradient-fadeout::before {
        content: '';
        width: calc((100%) - var(--scrollbarWidth) - var(--contentPadding));
        height: 75%;
        position: absolute;
        left: 0;
        top: 100;
        background: linear-gradient(180deg, rgba(251,226,107,0) 50%, rgba(251,226,107,1) 80%);
    }
    ::-webkit-scrollbar {
        width: var(--scrollbarWidth);
        z-index: 100;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
        background: #888;
    }
    .scrollbar-content{
        visibility: visible;
    }
</style>