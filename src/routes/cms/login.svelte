<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page, session } from '$app/stores';
  import useAuth from '$lib/auth';

  const { loadScript, initializeSignInWithGoogle } = useAuth(page, session, goto);

  onMount(async () => {
    await loadScript();
    initializeSignInWithGoogle('googleButton');
    if ($session.user) {
      goto($page.url.searchParams.get('referrer') ?? '/cms', { replaceState: true });
    }
  });

</script>

<svelte:head>
  <title>Login</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="login-page">
  <h2>LOGIN</h2>
  <div id="googleButton" />
</div>

<style lang="stylus">
  .login-page {
    h2 {
      typography: h2-responsive;
    }
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
</style>
