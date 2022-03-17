<script lang='ts'>
    export let block;

    let box : HTMLElement;
    let overflowActive : boolean = false;
    let yScroll : number = 0;
    let scrollbarFlag : boolean = false;

    let parseScroll = (e) => {
        let element = e.target;
        yScroll = element.scrollTop;
        if (element.scrollHeight - element.scrollTop === element.clientHeight){
            overflowActive = false;
        }
        else{
            overflowActive = true;
        }
    }

    let checkOverflow = (el) => {
        let curOverflow = el.style.overflow;
        if ( !curOverflow || curOverflow === "visible" )
            el.style.overflow = "hidden";
        let isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
        el.style.overflow = curOverflow;
        return isOverflowing;
    }

    $: if(box) overflowActive = checkOverflow(box);
    $: if(yScroll > 0) scrollbarFlag = false;
        else scrollbarFlag = true;
</script>


{#if block.content}
<div bind:this={box}
class="content"
class:bottomGradientFadeOut={overflowActive}
class:no-scrollbars={scrollbarFlag}
on:scroll={parseScroll}>
    {block.content[0].text}
</div>
{/if}

<style>
    .content{
        max-width: 100%;
        font-size: 16px;
        overflow: auto;
        height: 75%;
    }
    .bottomGradientFadeOut::before {
        content: '';
        width: calc((100%) - var(--scrollbarWidth) - var(--contentPadding)); /*30px padding + 10px scrollbar width*/
        height: 75%;
        position:absolute;
        left:0;
        top:100;
        background: linear-gradient(180deg, rgba(251,226,107,0) 50%, rgba(251,226,107,1) 80%);
    }
    /* width */
    ::-webkit-scrollbar {
        width: var(--scrollbarWidth);
        z-index: 100;
    }
    /* Track */
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #888;
    }
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
    /* Hide scrollbar for Chrome, Safari and Opera */
    .no-scrollbars::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .no-scrollbars{
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
</style>