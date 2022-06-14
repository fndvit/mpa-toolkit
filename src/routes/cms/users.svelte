<script lang="ts">
  import { session } from "$app/stores";
  import { updateUser } from "$lib/api";
  import EditableUserImage from "$lib/components/cms/EditableUserImage.svelte";
  import { getToaster } from "$lib/helpers/utils";
  import type { User, Role } from "$lib/types";

  export let users: User[];

  const toaster = getToaster();

  async function onChangeRole(user: User, role: string) {
    try {
      await updateUser(user.id, {role: role as User['role']});
      toaster('User role updated', {type: 'done'});

    } catch (err) {
      console.error(err);
      toaster(`Error updating user role: ${err.message}`, {type: 'error'});
    }
  }

  const roles: Role[] = ["ADMIN", "CONTENT_MANAGER", "USER"];

</script>

<div class="container">
  <h1>Users</h1>
  <div class="users">
    {#each users as user}
      <div>
        <EditableUserImage bind:user={user} />
      </div>
      <div data-id={user.id}>{user.name}</div>
      <div>{user.email}</div>
      <div>
        {#if $session.user.email === user.email}
          {user.role}
        {:else}
          <select value={user.role} on:change={evt => onChangeRole(user, evt.currentTarget.value)}>
            {#each roles as role}
              <option value="{role}">{role}</option>
            {/each}
          </select>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style lang="stylus">

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .users {
    typography: ui;
    display: grid;
    font-size: 20px;
    grid-template-columns: 100px 1fr 1fr 1fr;
    column-gap: 30px;
    row-gap: 30px;
    > * {
      display: flex;
      align-items: center;
    }
  }

  h1 {
    typography: h2-responsive;
  }

</style>