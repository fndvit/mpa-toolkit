<script lang="ts">
  import InlineSvg from "./generic/InlineSvg.svelte";
</script>

<div class="footer">

  <div class="footer-content">
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


</div>

<style lang="stylus">

  .footer {
    grid-config(page, footer);

    background: $colors.neutral-bg;

    p {
      font-weight: bold;
    }
  }

  .footer-content {
    grid-area: footer;
  }

  .partners-grid {
    display: grid;
    grid-template-columns: 126px 87px 148px 135px 39px;
    align-items: center;
    gap: 45px;
    color: $colors.neutral-dark;
  }

  .links {
    margin: 40px 0px;
    display: flex;
    flex-direction: column;
    gap: 0.55em;

    a {
      color: $colors.neutral-dark;
      font-size: 12px;
      margin-right: 15px;
    }
  }

  @media(max-width: 1024px) {

    .partners-grid {

      grid-template-columns: 0.25fr 0.25fr 0.25fr;
      grid-template-rows: auto;
      margin-top: 3rem;

    }

    .links {

      width: 100%;
      a {
        font-size: 1.25rem;
      }

    }
  }

  @media(max-width: 768px) {

    .links {
      a {
        font-size: 1rem;
      }
    }

  }

  @media(max-width: 425px) {


    .links {
      a {
        font-size: 0.75rem;
      }
    }

  }

</style>