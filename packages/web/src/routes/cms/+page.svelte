<script lang="ts">
  import type { LayoutData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import * as api from '$lib/api';
  import { toaster } from '$lib/components/generic';

  const { user } = $page.data as LayoutData;

  const onClickLogout = async () => {
    const success = await api.auth.logout();
    if (!success) {
      toaster.error('Logout failed');
    } else {
      goto('/cms/login');
    }
  };
</script>

<div class="cms-homepage">
  {#if user}
    <h3>WELCOME {user.name}</h3>

    <div class="grid-links">
      <a href="cms/pages"><span class="material-icons">description</span>Pages</a>
      <a href="cms/tags"><span class="material-icons">sell</span>Tags</a>
      <a href="cms/authors"><span class="material-icons">face</span>Authors</a>

      {#if user.role == 'ADMIN'}
        <a href="cms/users"><span class="material-icons">person</span>Users</a>
        <a href="cms/homepage"><span class="material-icons">sort</span>Page Ordering</a>
      {/if}
    </div>

    <div style="margin-top: 40px">
      <button class="logout-button" on:click={onClickLogout}>Signout</button>
    </div>
  {/if}
</div>

<style lang="postcss">
  .material-icons {
    font-size: 77px;
  }

  .cms-homepage {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    h3 {
      @mixin font-responsive h3-light;

      margin-bottom: 40px;
      text-align: center;
    }

    a {
      font: $f-ui-small;
      color: black;
      text-decoration: none;
    }
  }

  .grid-links {
    display: flex;
    column-gap: 24px;
    row-gap: 24px;

    > :global(a) {
      font: $f-ui-small;
      text-transform: uppercase;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      background: white;
      border-radius: 24px;
      box-shadow: 0 1px 16px rgb(0 0 0 / 10%);
      padding: 20px 10px 10px;
      width: 185px;
      height: 140px;
      box-sizing: border-box;

      &:hover {
        background: $c-neutral-light;
        text-decoration: none;
      }
    }
  }

  .logout-button {
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    font: $f-ui-small;
  }
</style>
