<script lang="ts">
  import InlineSvg from "./generic/InlineSvg.svelte";
</script>

<div class="container">
  <p>A partnership between</p>
  <div class="partners-grid">
    <InlineSvg svg="UNEP" />
    <InlineSvg svg="IAFDC" />
    <InlineSvg svg="UoQ" />
    <InlineSvg svg="TNC" />
    <InlineSvg svg="WWF" />
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
    color: #6C767D;
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