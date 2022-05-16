<script lang="ts">
  import Unep_Logo from "/static/footer/unep_Logo.svg";
  import TNC_Logo from "/static/footer/TNC_Logo.svg";
  import UoQ_Logo from "/static/footer/UoQ_Logo.svg";
  import WWF_Logo from "/static/footer/WWF_Logo.svg";
  import IAFDC_Logo from "/static/footer/IAFDC_Logo.png";
</script>

<div class="container">

  <p>A partnership between</p>

  <div class="partners-grid">
    <img src={Unep_Logo} alt="United Nations Environmetal Programme">
    <img src={IAFDC_Logo} width={87} alt="Italian Agency for Development Cooperation logo">
    <img src={UoQ_Logo} alt="University of Queensland logo">
    <img src={TNC_Logo} alt="The Nature Conservancy logo">
    <img src={WWF_Logo} alt="World Wildlife Fund logo">
  </div>

  <div class="links">
    <div>
      <a href="/cms" rel="external"><b>Contact us</b></a>
      <a href="/cms" rel="external"><b>Follow us</b></a>
    </div>
    <div>
      <a href="/cms" rel="external">Partners</a>
      <a href="/cms" rel="external">Team</a>
      <a href="/cms" rel="external">Privacy policy</a>
      <a href="/cms" rel="external">Terms of use</a>
      <a href="/cms" rel="external">Sitemap</a>
    </div>
  </div>
</div>

<style lang="scss">

  .container {
    padding-left: 124px;
    background: #F9F9F9;

    p {
      font-weight: bold;
    }
  }

  .partners-grid {
    display: grid;
    grid-template-columns: 126px 87px 148px 135px 39px;
    align-items: center;
    gap: 45px;
  }

  .links {
    margin: 40px 0px;
    display: flex;
    flex-direction: column;
    gap: 0.55em;

    a {
      color: #6C767D;
      font-size: 12px;
      margin-right: 15px;
    }
  }
</style>