<script context="module" lang="ts">
</script>

<script lang="ts">
  import LandingCarousel from "$lib/components/LandingCarousel.svelte";
  import TopSearchBar from "$lib/components/TopSearchBar.svelte";
  const backgroundImage = 'src/lib/components/images/LandingBackground.png';
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<div>
  <img class="unep-logo" src="/unep.svg" alt="unep-logo" />
  <a class="cms" href="/cms" rel="external">Access CMS</a>
  <div class="top-searchbar">
    <TopSearchBar/>
  </div>
  <div class="splash" style="background-image: url({backgroundImage})">
    <h1>Here it is.<br><b>Your MPA toolkit.</b></h1>
    <h4>A brand-new, growing <b>educational platform</b> for the MPA community to share lessons, challenges and sustainable solutions.</h4>
  </div>

  <LandingCarousel type={'chapter'}/>
  <LandingCarousel type={'case study'}/>
</div>


<style lang="scss">

  .top-searchbar {
    position: absolute;
    margin: 2rem;
    right: 0px;
  }

  .cms {
    color: #F9F9F9;
    font-weight: bold;
    position: absolute;
    left: 50%;
    margin: 2rem;
  }

  .splash {
    min-height: 60vh;
    padding: 6rem;
    padding-bottom: 3rem;
    padding-left: 124px;
    background-size: cover;
    background-position: bottom;
    background-image: url(--background-image);

    h1 {
      font-weight: 200;
      font-size: 120px;
      color: #FFFFFF;
      line-height: 1.15;
      margin-bottom: 0px;
    }

    h4 {
      margin-top: 20px;
      color: #FFFFFF;
      font-size: 36px;
      max-width: 800px;
      font-weight: 200;
    }

  }

  .unep-logo {
    position: absolute;
    margin: 2rem;
  }

</style>
