<script context="module" lang="ts">
</script>

<script lang="ts">
  import type { PageTag } from "$lib/types";

  import LandingCarousel from "$lib/components/LandingCarousel.svelte";
  import MadLib from "$lib/components/MadLib.svelte";
  import Searchbar from "$lib/components/Searchbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import TagContainer from "$lib/components/Tags/TagContainer.svelte";

  import IAFDC_Logo from "/static/IAFDC_Logo.svg";
  import TNC_Logo from "/static/TNC_Logo.svg";
  import UoQ_Logo from "/static/UoQ_Logo.svg";
  import WWF_Logo from "/static/WWF_Logo.svg";

  const backgroundImage = '/static/LandingSplashImage.png';

  const exampleTags: PageTag[] = [
    {tag: {id: 1, value: 'Blue economy', type: 'USER'}, category: 'PRIMARY'},
    {tag: {id: 2, value: 'MPAs', type: 'USER'}, category: 'PRIMARY'},
    {tag: {id: 3, value: 'Blue growth', type: 'USER'}, category: 'PRIMARY'},
    {tag: {id: 4, value: 'Ocean conservation', type: 'USER'}, category: 'PRIMARY'},
    {tag: {id: 5, value: 'Sustainable development', type: 'USER'}, category: 'PRIMARY'},
    {tag: {id: 6, value: 'Nature-based solutions', type: 'USER'}, category: 'PRIMARY'},
    {tag: {id: 7, value: 'All biomes', type: 'USER'}, category: 'PRIMARY'}
  ];

</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<div class="container">
  <img class="unep-logo" src="/static/unep.svg" alt="unep-logo" />
  <div class="top-searchbar">
    <Searchbar type={'top'}/>
  </div>
  <div class="splash" style="background-image: url({backgroundImage})">
    <h1>Here it is.<br><b>Your MPA toolkit.</b></h1>
    <h4>A brand-new, growing <b>educational platform</b> for the MPA community to share lessons, challenges and sustainable solutions.</h4>
    <p>In partnership with</p>
    <div class="partners-grid">
      <img src={IAFDC_Logo} alt="Italian Agency for Development Cooperation logo">
      <img src={UoQ_Logo} alt="University of Queensland logo">
      <img src={TNC_Logo} alt="The Nature Conservancy logo">
      <img src={WWF_Logo} alt="World Wildlife Fund logo">
    </div>
  </div>

  <LandingCarousel type={'chapter'}/>
  <div class="inline-searchbar">
    <Searchbar type={'inline'}/>
    <TagContainer tags={exampleTags}/>
  </div>
  <MadLib type='landing'/>
  <LandingCarousel type={'case study'}/>
  <Footer/>
</div>


<style lang="scss">


  .inline-searchbar {
    width: 766px;
    margin: 50px auto;
    :global(.tag-container) {
      margin: 15px 13px 0;
    }
  }

  .partners-grid {
    display: grid;
    grid-template-columns: 108px 185px 168px 50px;
    align-items: center;
    gap: 45px;
  }

  .top-searchbar {
    position: absolute;
    margin: 2rem;
    right: 0px;
  }

  .splash {
    min-height: 60vh;
    padding: 6rem;
    padding-bottom: 3rem;
    padding-left: 124px;
    background-size: cover;
    background-position: bottom;

    h1 {
      font-weight: 200;
      font-size: 120px;
      color: #FFFFFF;
      line-height: 1.15;
      margin-bottom: 15px;
    }

    h4 {
      margin-top: 25px;
      margin-bottom: 80px;
      color: #FFFFFF;
      font-size: 36px;
      max-width: 800px;
      font-weight: 200;
    }

    p {
      font-weight: bold;
      color: black;
    }

  }

  .unep-logo {
    position: absolute;
    margin: 2rem;
  }

  .container {
    background: #F9F9F9;
  }

</style>
