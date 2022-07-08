<script lang="ts">
  import { session } from "$app/stores";
  import InlineSvgLink from '$lib/components/generic/InlineSvgLink.svelte';

</script>

<div class="cms-homepage">

  {#if $session.user === undefined}

    <h2>WELCOME</h2>

    <div class="signIn-button">
      <a href="/api/auth/signin/google">
        Sign in with Google
      </a>
    </div>

  {:else}

    <h3>WELCOME {$session.user.name}</h3>

    <div class="grid-links">

      <InlineSvgLink href="/cms/pages" svg="FileIcon">Pages</InlineSvgLink>
      <InlineSvgLink href="/cms/tags" svg="TagIcon">Tags</InlineSvgLink>

      {#if $session.user.role == "ADMIN"}
        <InlineSvgLink href="/cms/users" svg="UserIcon">Users</InlineSvgLink>
      {/if}

    </div>

    <div style="margin-top: 40px">
      <a href="/api/auth/signout">Signout</a>
    </div>
  {/if}
</div>

<style lang="stylus">

 .cms-homepage {

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    h2 {
      typography: h2-responsive;
      margin-bottom: 30px;
      text-align: center;
    }

    h3 {
      typography: h3-light-responsive;
      margin-bottom: 40px;
      text-align: center;
    }

    a {
      typography: ui-small;
      color: black;
      text-decoration: none;
    }
  }

  .signIn-button {

    padding: 1.5rem;
    width: 275px;
    background: $colors.neutral-light;
    border-radius: 24px;

  }

  .grid-links {
    display: flex;
    column-gap: 24px;
    row-gap: 24px;

    > :global(a) {
      typography: ui-small;
      text-transform: uppercase;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      background: white;
      border-radius: 24px;
      box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);
      padding: 20px 10px 10px;
      width: 185px;
      height: 140px;
      box-sizing: border-box;

      &:hover {
        background: $colors.neutral-light;
        text-decoration: none;
      }
    }

  }

</style>
