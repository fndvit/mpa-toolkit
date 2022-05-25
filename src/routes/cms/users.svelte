<script lang="ts">
  import { session } from "$app/stores";
  import EditableUserImage from "$lib/components/cms/EditableUserImage.svelte";
  import type { User, Role } from "$lib/types";

  export let users: User[];

  async function onChangeRole(user: User, role: string) {
    try {
      await fetch(`/api/users/${user.id}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
    } catch (err) {
      console.error(err);
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

<style lang="scss">

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .users {
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

</style>