<script lang='ts'>
    import {Splide, SplideSlide} from "@splidejs/svelte-splide";
    import { onMount } from "svelte";
    import './styles.css';
    import '@splidejs/splide/dist/css/splide.min.css';
    import CarouselDots from './CarouselDots.svelte'

    export let block;
    export let backgroundColor : string = '#fbe26b';
    export let buttonColor : string = '#fbe26b';
    export let textColor : string = '#202020';
    export let slides = [];
    export let currentPageIndex : number = 0;
    export let width : number = 800;
    export let height : number = 300;
    let splide : any;
    let controller : any;
    let splideElement : HTMLElement;
    let box : HTMLElement;
    let yScroll : number = 0;
    let overflowActive : boolean = false;
    let options =
    {
        rewind: true,
        width : width,
        height : height,
        gap: -3,
        classes: {
            pagination : 'vanish',
            arrows: 'vanish',
        },
    }
    function parseScroll(e) {
        let element = e.target;
        yScroll= element.scrollTop;
        if (element.scrollHeight - element.scrollTop === element.clientHeight){
            overflowActive = false;
        }
        else{
            overflowActive = true;
        }
    }
    onMount(() => {
        controller = splide.splide.Components.Controller;
        splideElement = document.getElementById('splide');
    });
    let handlePrevButton = () => {
        splide.go(controller.getPrev())
    }
    let handleNextButton = () => {
        splide.go(controller.getNext())
    }
    let handleDotClick = (index) => {
        splide.go(index)
    }
    let handleMove = (event) => {
        currentPageIndex = event.detail.index;
    }
    function checkOverflow(el)
    {
        let curOverflow = el.style.overflow;
        if ( !curOverflow || curOverflow === "visible" )
            el.style.overflow = "hidden";
        let isOverflowing = el.clientWidth < el.scrollWidth
            || el.clientHeight < el.scrollHeight;
        el.style.overflow = curOverflow;
        return isOverflowing;
    }
    $: if(currentPageIndex >= 0 && splide) splide.go(currentPageIndex);
    $: if(box) overflowActive = checkOverflow(box);
    $: if(yScroll > 0) document.documentElement.classList.remove('no-scrollbars');
       else document.documentElement.classList.add('no-scrollbars');
    $: if(width) options.width = width;
    $: if(options) console.log(options);

    console.log(block);
</script>

<div class="container" style="background-color: {backgroundColor};">
    <Splide
    bind:options={options}
    bind:this={splide}
    on:move={handleMove}
    >
        <div class="navigationButtons" slot="before-track">
            <div on:click={handlePrevButton} class="button prev" style="background-color: {buttonColor};">
                &#10094;
            </div>
            <div on:click={handleNextButton} class="button next" style="background-color: {buttonColor};">
                &#10095;
            </div>
        </div>
        {#each slides as slide, i}
        <SplideSlide>
            <div  class="slide" style="background: {backgroundColor};">
            <div class="info" style="color: {textColor};">
                <div class="title">{slide.title}</div>
                {#if currentPageIndex === i}
                <div bind:this={box}
                class="content"
                class:bottomGradientFadeOut='{overflowActive}'
                on:scroll={parseScroll}>
                    {slide.content}
                </div>
                {:else}
                <div class="content" on:scroll={parseScroll}>
                    {slide.content}
                 </div>
                {/if}

            </div>
            </div>
        </SplideSlide>
        {/each}
        <div slot="after-track" class="custom-dots">
            <CarouselDots
            currentPageIndex={currentPageIndex}
            pagesCount={slides.length}
            progress={false}
            color={textColor}
            handleDotClick={handleDotClick}/>
        </div>
    </Splide>
</div>

<style type="text/postcss">
    :root{
        --contentPadding: 30px;
        --scrollbarWidth: 10px;
    }
    .container :global(.splide__track){
        border-radius: 15px;
    }
    .container{
        border-radius: 15px;
        width: max-content;
    }
    .navigationButtons{
        width: 100px;
        display: inline-flex;
        position: absolute;
        z-index: 2;
        right: 0;
        margin-top: 20px;
        margin-right: 20px;
    }
    .navigationButtons .button{
        border: rgba(0, 0, 0, 0.1) solid 1px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        margin-right: 10px;
        text-align: center;
        line-height: 40px;
    }
    .navigationButtons .button:hover{
        box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.2);
    }
    .slide{
        overflow: hidden;
        height: 100%;
    }
    .info{
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        top: 0;
        padding: 15px var(--contentPadding);
        height: 80%;
    }
    .slide .info .title{
        font-size: 16px;
        font-weight: 700;
        height: 25%;
    }
    .slide .info .content{
        max-width: 100%;
        font-size: 16px;
        overflow: auto;
        height: 75%;
    }
    .custom-dots{
        position: absolute;
        bottom: 10px;
        left: 0;
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
</style>