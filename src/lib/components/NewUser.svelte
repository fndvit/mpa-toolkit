<script lang="ts">
  import { getToaster } from "$lib/helpers/utils";
  import { createUser } from "$lib/api";
  import type { Role } from "@prisma/client";

  export let isOpen: boolean;

  const toaster = getToaster();
  const roles = ["ADMIN", "CONTENT_MANAGER", "USER"];

  let name = "";
  let email = null;
  let role: Role;

  async function addNewUser() {
    if(name != null) {
      try {
        await createUser({name, email, role});
        toaster('User created', {type: 'done'});

      } catch (err) {
        console.error(err);
        toaster(`Error creating a new user: ${err.message}`, {type: 'error'});
      }
    }
  }
</script>

{#if isOpen}
<div class="modal">

  <h1>NEW USER</h1>

  <form class="inputs">
    <div>
      <input type="text" bind:value={name} placeholder="Name" required>
    </div>
    <div>
      <input type="text" bind:value={email} placeholder="Email">
    </div>
    <select bind:value={role} required>
      {#each roles as role}
        <option value="{role}">{role}</option>
      {/each}
    </select>
    <button class="add-user" on:click|preventDefault={() => addNewUser()}>ADD</button>
  </form>
</div>
{/if}

<style lang="stylus">

  .modal {
    position: fixed;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 420px;

    background: white;
    border-radius: 24px;
    box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);
    text-align: center;

    h1 {
      typography: h3-light-responsive;
      margin: 2rem;
    }

  }

  .inputs {
    typography: h5-light;

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

    select {
      border: none;
      padding: 1rem;
      width: 300px;
      background-color: $colors.neutral-bg;
      border-radius: 10px;
      typography: ui;
      margin: 1.5rem;
    }
  }

  .add-user {
    typography: ui;
    padding: 1rem;
    width: 115px;
    background: white;
    border-radius: 10px;
    border: none;
    box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);

    margin: 5rem 2rem;

    &:hover {
      background: $colors.neutral-bg;
    }
  }

</style>