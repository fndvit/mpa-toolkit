<script lang="ts">
  import { session } from "$app/stores";

</script>

{#if $session.user === undefined}
  <a href="/api/auth/signin/google">
    Sign in with Google
  </a>
{:else}
  <div>
    Logged in as {$session.user.role} {$session.user.email}
    <a href="/api/auth/signout">Signout</a>
  </div>
  <div>
    <a href="/cms/pages">Pages</a>
    <a href="/cms/users">Users</a>
    <a href="/cms/tags">Tags</a>
  </div>
{/if}
