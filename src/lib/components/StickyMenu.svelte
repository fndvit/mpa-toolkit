<script lang='ts'>
    import { onMount } from 'svelte';
    import MenuSpy from '../menuspy';
    import type { MenuSpyParams} from '../menuspy';
    import * as animateScroll from "svelte-scrollto";
    export let menuOptions = []
    let elm : Element;
    let ms : MenuSpy;
    var msParams : MenuSpyParams = {
        menuItemSelector : '[href^="#"]',
        activeClass: 'active',
        threshold: 150,
        enableLocationHash: true,
        hashTimeout: 0,
        callback: null
    };
    let width : number;
    let smallScreen : boolean;
    onMount(() => {
        elm = document.querySelector('#main-menu');
        ms = new MenuSpy(elm, msParams);
    })
</script>

<svelte:window bind:innerWidth={width}/>
<nav class="mainnav" id="main-menu">
    {#each menuOptions as option, i}
    <div
        class='menuoption {i === 0 ? "active" : ""}'
        on:click=
        {
        animateScroll.scrollTo({
            element: `#${option.text.replace(/\s/g, '')}`,

            onStart: () => {
                console.log(ms);
                ms.activateItem(ms.scrollItems[i]);
                ms.dissableUpdate();
            },
            onDone: () => { ms.enableUpdate(); }
        })
        }
        id="{option.text.replace(/\s/g, '')}div"
    >
    <div href='#{option.text.replace(/\s/g, '')}'>
        {option.text}
    </div>
</div>
    {/each}

</nav>

<style>
    .mainnav{
        position: fixed;
        top: 0;
        width: 215px;
        left: 66px;
        z-index: 10;
        background: #F9F9F9;
        box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);
        border-radius: 0px 0px 20px 20px;
        padding-top: 31px;
        padding-bottom: 29px;
    }
    .menuoption{
        margin: 10px 40px 0px 28px;
        font-family: 'Montserrat';
        font-size: 12px;
        font-weight: 300;
        line-height: 18px;
        cursor: pointer;
    }
    .active{
        font-weight: 700;
    }
</style>