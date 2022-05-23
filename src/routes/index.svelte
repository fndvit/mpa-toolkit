<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import LandingCarousel from "$lib/components/LandingCarousel.svelte";
  import MadLib from "$lib/components/MadLib.svelte";
  import Searchbar from "$lib/components/generic/Searchbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import TagContainer from "$lib/components/TagContainer.svelte";
  import InlineSvg from "$lib/components/generic/InlineSvg.svelte";

  const exampleTags: SubTypes.PageTag[] = [
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
  <div class="unep-logo">
    <InlineSvg svg="UNEP" />
  </div>
  <div class="top-searchbar">
    <Searchbar type={'top'}/>
  </div>
  <div class="splash" style="background-image: url(/static/LandingSplashImage.png)">
    <h1>Here it is.<br><b>Your MPA toolkit.</b></h1>
    <h4>A brand-new, growing <b>educational platform</b> for the MPA community to share lessons, challenges and sustainable solutions.</h4>
    <p>In partnership with</p>
    <div class="partners-grid">
      <InlineSvg svg="IAFDC" />
      <InlineSvg svg="UoQ" />
      <InlineSvg svg="TNC" />
      <InlineSvg svg="WWF" />
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
    color: white;
    width: 110px;
  }

  .container {
    background: #F9F9F9;
  }

</style>
