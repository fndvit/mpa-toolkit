<script lang="ts">
  import type { Role, User } from '@mpa/db';
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import * as api from '$lib/api';
  import { toaster } from '$lib/components/generic/Toaster';

  export let data: PageData;
  let { users } = data;

  async function onChangeRole(user: User.Session, role: string) {
    toaster.report(() => api.user.update(user.id, { role: <Role>role }), 'Role updated', 'Error updating role');
  }

  async function onChangeName(user: User.Session, name: string) {
    toaster.report(() => api.user.update(user.id, { name }), 'Name updated', 'Error updating name');
  }

  async function onClickDeleteUser(user: User.Session) {
    toaster.report(() => api.user.delete(user.id), 'User deleted', 'Error deleting user');
    users = users.filter(row => row != user);
  }

  const roles: Role[] = ['ADMIN', 'CONTENT_MANAGER', 'USER'];
</script>

<div class="container">
  <div class="title">
    <a href="/cms"><span class="material-icons arrow">navigate_before</span></a>
    <h1>Users</h1>
  </div>

  <div class="users">
    {#each users as user (user.id)}
      <div data-id={user.id}>
        <input type="text" value={user.name} on:change={evt => onChangeName(user, evt.currentTarget.value)} />
      </div>
      <div>
        {#if user.email != null}
          {user.email}
        {/if}
      </div>
      <div>
        {#if $page.data.user.id === user.id}
          {user.role}
        {:else}
          <select value={user.role} on:change={evt => onChangeRole(user, evt.currentTarget.value)}>
            {#each roles as role}
              <option value={role}>{role}</option>
            {/each}
          </select>
        {/if}
      </div>
      <div>
        <button on:click|once={() => onClickDeleteUser(user)} class="delete-user">
          <div class="material-icons">delete</div>
        </button>
      </div>
    {/each}
  </div>
</div>

<style lang="postcss">
  .container {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem 6rem;
    margin: 0 auto;
  }

  .users {
    margin-top: 80px;
    font: $f-ui;
    display: grid;
    font-size: 20px;
    grid-template-columns: 1.25fr 1.25fr 1.25fr 0.25fr;
    row-gap: 30px;

    > * {
      display: flex;
      align-items: center;
      border-bottom: solid 3px #f5f5f5;
      padding-bottom: 10px;
    }

    select {
      padding: 1rem;
      width: 249px;
      background-color: $c-neutral-bg;
      border: none;
      border-radius: 10px;
      font: $f-ui;

      &:focus {
        outline: none;
      }
    }

    .delete-user {
      border: none;
      background: none;
      margin-left: auto;
      margin-right: 0;
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
      }
    }

    input {
      border: none;
      margin: 1.5rem;
      text-decoration: none;
      width: 300px;

      &:focus {
        outline: none;
        border-bottom: solid 1px;
      }
    }
  }

  h1 {
    @mixin font-responsive h2;
  }

  .title {
    display: flex;
    align-items: center;
    column-gap: 30px;
    margin-bottom: 20px;

    --ib-hover-border: 1px solid #ddd;

    .arrow {
      color: black;
      font-size: 32px;
    }
  }
</style>
