<script lang="ts">
  import InlineSvg from "./generic/InlineSvg.svelte";
  import Searchbar from './generic/Searchbar.svelte';
  import landingMadlibBg from '$lib/assets/landing-madlib-bg.jpg';
</script>

<div class="container" style="background-image: url({landingMadlibBg})">
  <div class="unep-logo">
    <InlineSvg svg="UNEP" />
  </div>

  <div class="bottom-section">
    <h2 class="text">Sustainable financing</h2>
    <div class="search-bar">
      <Searchbar type={'collection'} />
    </div>
  </div>
</div>

<style lang="scss">
  .container {
    height: 336px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    width: 100%;
  }
  .text {
    position: absolute;
    bottom: 32px;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 300;
    font-size: 48px;
    line-height: 59px;
    color: #ffffff;
    margin: 0px 10px 0px 90px;
  }
  .search-bar {
    width: 50%;
    position: absolute;
    bottom: 32px;
    right: 96px;
  }
  .unep-logo {
    position: absolute;
    margin: 2rem;
    width: 110px;
    color: white;
  }
  @media only screen and (max-width: 1450px) {
    .search-bar {
      width: 40%;
      right: 86px;
    }
    .text{
      font-size: 40px;
      margin: 0px 10px 0px 80px;
    }
  }
  @media only screen and (max-width: 1024px) {
    .bottom-section{
      position: absolute;
      bottom: 57px;
      width: 100%;
      text-align: center;
    }
    .search-bar {
      position: static;
      width: 90%;
      margin: 0 auto;
    }
    .text {
      margin: 0px 10px 0px 10px;
      position: static;
      font-size: 32px;
      margin-bottom: 30px;
    }
  }
  @media only screen and (max-width: 768px) {

  }
</style>
