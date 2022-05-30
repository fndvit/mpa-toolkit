<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import type { PageTag } from "$lib/prisma/queries";
  import LandingCarousel from "$lib/components/LandingCarousel.svelte";
  import Searchbar from "$lib/components/generic/Searchbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import TagContainer from "$lib/components/TagContainer.svelte";
  import InlineSvg from "$lib/components/generic/InlineSvg.svelte";
  import landingSplash from '$lib/assets/landing-splash.jpg';
  import MpaManagementLifecycle from "$lib/components/MPAManagementLifecycle.svelte";
  import LandingMadlib from "$lib/components/Madlib/LandingMadLib.svelte";

  export let chapters: SubTypes.Page.ContentCard[] = [];
  export let caseStudies: SubTypes.Page.ContentCard[] = [];
  export let tags: SubTypes.Tag[] = [];

  const tagsForContainer = tags.map<PageTag>(t => ({tag: t, category: 'PRIMARY'}));

</script>

<svelte:head>
  <title>MPA Toolkit</title>
</svelte:head>

<div class="landing-page">
  <div class="unep-logo">
    <InlineSvg svg="UNEP" />
  </div>
  <div class="top-searchbar">
    <Searchbar type={'top'}/>
  </div>
  <div class="splash" style="background-image: url({landingSplash})">
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

  <MpaManagementLifecycle/>

  <LandingCarousel pages={chapters} title="Get the <b>answers</b> to all your questions" />

  <div class="inline-searchbar">
    <Searchbar type={'inline'}/>
    <TagContainer tags={tagsForContainer}/>
  </div>
  <LandingMadlib />
  <LandingCarousel pages={caseStudies} title="Explore what <b>others have done</b>" />
  <Footer/>
</div>


<style lang="scss">

  .landing-page {
    background: #F9F9F9;
    --page-padding: 6rem;
  }

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
    padding: 6rem var(--page-padding) 3rem;
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



  @media (max-width: 1024px) {

    .landing-page {
      --page-padding: 3rem;
    }

    .splash {
      // padding-left: 3rem;

      background-position: left;

      h1 {
        font-size: 4rem;
        padding-bottom: 4rem;
        padding-top: 4rem;
      }

      h4 {
        padding-bottom: 3rem;
      }

    }

    .unep-logo {
      margin-left: 3rem;
    }

    .inline-searchbar {
      width: auto;
      // padding: 3rem;

      > :global(.tag-container) {
        flex-wrap: nowrap;
        overflow-x: scroll;
      }

    }

    .top-searchbar {

      :global(.placeholder) {
        display: none;
      }

      :global(.input-text) {
        max-width: 50px;
      }
    }

  }

  @media(max-width: 700px) {

    .partners-grid {
      grid-template-columns: 150px 100px;
    }

    .inline-searchbar {
      margin: 0rem;
    }

  }

  @media(max-width: 425px) {


    .landing-page {
      --page-padding: 1.5rem;
    }
    .splash {

      h1 {
        font-size: 2rem;
        padding: 1rem 0rem;
      }

      h4 {
        margin-bottom: 1rem;
        padding: 1rem 0rem;
        font-size: 1.25rem;
      }

    }

    .partners-grid {
      grid-template-columns: 100px 70px;
    }

    .top-searchbar {

      margin: 2rem 1rem;

      :global(.input-text) {
        max-width: 10px;
        padding: 7px
      }

      :global(.search-icon) {
        width: 20px;
        height: 20px;
      }
    }

    .inline-searchbar {
      // padding: 1rem;
    }

    .unep-logo {
      width: 80px;
      margin-left: 2rem;
    }

  }



</style>
