<script>
  import { page } from '$app/stores';
</script>

<div class="container">
  <h1>{$page.status} error</h1>
  {#if $page.status === 404}
    <p>
      Erm ...<br />
      That's a bit awkward ...<br />
      But ...<br />
      We couldn't find that page<br />
      Try going to <a href="/">MPAth's home page</a>.
    </p>
  {:else}
    <div class="inner">
      <p>
        Ooops!!<br />
        This one's one us <br />
        — something's not right on our side.<br />
        Refresh your browser or try us later maybe?
      </p>
    </div>
  {/if}
</div>

<style lang="postcss">
  .container {
    margin: 3rem;
    color: $c-neutral-dark;

    h1 {
      @mixin font-responsive h1;

      margin: 0;
    }

    p {
      @mixin font-responsive p-large;
    }

    a {
      font-weight: bold;
      color: $c-neutral-dark;
    }
  }
</style>
