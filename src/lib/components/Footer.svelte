<script lang="ts">
  import InlineSvg from "./generic/InlineSvg.svelte";
</script>

<div class="footer">

  <div class="footer-content">
    <h5>A partnership between</h5>

    <div class="partners-grid">
      <InlineSvg svg="UNEP" />
      <InlineSvg svg="IAFDC" />
      <InlineSvg svg="UoQ" />
      <InlineSvg svg="TNC" />
      <InlineSvg svg="WWF" />
    </div>

    <div class="links">

      <div>
        <a href="/cms" rel="external">Contact us</a>
        <a href="/cms" rel="external">Follow us</a>
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
    grid-content(page, footer);

    background: $colors.neutral-bg;

    p {
      font-weight: bold;
    }
  }

  .footer-content {
    grid-area: footer;
    > h5 {
      typography: h5-responsive;
    }
  }

  .partners-grid {
    display: grid;
    grid-template-columns: 126px 87px 148px 135px 39px;
    align-items: center;
    gap: 45px;
    color: $colors.neutral-dark;
  }

  .links {
    typography: ui-small;
    margin: 40px 0px;
    display: flex;
    flex-direction: column;
    gap: 0.55em;

    > div:first-child {
      font-weight: 700;
    }

    a {
      color: $colors.neutral-dark;
      margin-right: 15px;
    }
  }

  @media(max-width: 1024px) {

    .partners-grid {
      grid-template-columns: 0.25fr 0.25fr 0.25fr;
      grid-template-rows: auto;
      margin-top: 3rem;
    }
  }

</style>