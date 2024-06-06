<script lang="ts">
  import { InlineSvgLink } from '$lib/components/generic';
</script>

<div class="footer">
  <div class="footer-content">
    <h5>A partnership between</h5>

    <div class="partners-grid">
      <div class="partners-grid-1">
        <InlineSvgLink href="https://www.aics.gov.it/language/en/" svg="IAFDC" newTab />
        <InlineSvgLink href="https://www.uq.edu.au" svg="UoQ" newTab />
      </div>
      <div class="partners-grid-2">
        <InlineSvgLink href="https://www.nature.org/" svg="TNC" newTab />
        <InlineSvgLink href="https://wwf.panda.org" svg="WWF" newTab />
      </div>
      <div class="partners-grid-3">
        <InlineSvgLink href="https://coralreefrescueinitiative.org/" svg="CRRI" newTab />
        <InlineSvgLink href="https://www.udg.edu/en/" svg="UdG" newTab />
        <InlineSvgLink href="https://www.fundaciovit.org/" svg="ViT" newTab />
      </div>
    </div>

    <div class="links">
      <div>
        <a href="/partners" rel="external">About us</a>
      </div>

      <div>
        <a href="/team" rel="external">Team</a>
        <a href="/privacy-policy" rel="external">Privacy policy</a>
        <a href="/terms-of-use" rel="external">Terms of use</a>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .footer {
    @mixin grid-config content, footer;

    background: $c-neutral-bg;
  }

  .footer-content {
    grid-area: footer;

    > h5 {
      @mixin font-responsive h5;
    }
  }

  .partners-grid {
    display: grid;
    grid-template-rows: auto;
    align-items: center;
    gap: 45px;
    row-gap:24px;
  }

  .partners-grid-1 {
    display: inherit;
    grid-template-columns: 87px 148px 1fr;
    align-items: inherit;
    gap: inherit;
    color: inherit;
  }

  .partners-grid-2 {
    display: inherit;
    grid-template-columns: 135px 39px;
    align-items: inherit;
    gap: inherit;
    color: inherit;
  }

  .partners-grid-3 {
    display: inherit;
    grid-template-columns: 90px 100px 64px;
    align-items: inherit;
    gap: inherit;
    color: inherit;
  }

  .links {
    font: $f-ui-small;
    margin: 40px 0;
    display: flex;
    flex-direction: column;
    gap: 0.55em;

    > div:first-child {
      font-weight: 700;
    }

    a {
      color: $c-neutral-dark;
      margin-right: 15px;
    }
  }

  @media (max-width: 1024px) {
    .partners-grid {
      grid-template-rows: auto;
      margin-top: 1rem;
    }
    .partners-grid-1 {
      grid-template-columns: 87px 39px;
    }

    .partners-grid-2 {
      grid-template-columns: 135px 39px;
    }
    .partners-grid-3 {
      grid-template-columns: 90px 100px 64px;
    }
  }
</style>
