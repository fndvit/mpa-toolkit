<script lang="ts">
  import type { User, Role } from "$lib/types";

  export let users: User[];

  async function onChangeRole(user: User, role: Role) {
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

</script>

<div>
  <h1>Users</h1>
  <div class="users">
    {#each users as user}
      <div>{user.name}</div>
      <div>{user.email}</div>
      <div>
        <select value={user.role} on:change={evt => onChangeRole(user, evt.currentTarget.value)}>
        <option value="ADMIN">ADMIN</option>
          <option value="CONTENT_MANAGER">CONTENT_MANAGER</option>
          <option value="USER">USER</option>
        </select>
      </div>
    {/each}
  </div>
</div>

<style>
  .users {
    display: grid;
    font-size: 20px;
    grid-template-columns: 200px 250px 1fr;
  }
</style>