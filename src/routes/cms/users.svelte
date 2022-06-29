<script lang="ts">

  import { session } from "$app/stores";
  import { updateUser, deleteUser } from "$lib/api";
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

  async function onChangeName(user: User, name: string) {
    try {
      await updateUser(user.id, {name: name as User['name']});
      toaster('User name updated', {type: 'done'});

    } catch (err) {
      console.error(err);
      toaster(`Error updating user name: ${err.message}`, {type: 'error'});
    }
  }

  async function onClickDeleteUser(user: User) {
    
    try {
      await deleteUser(user.id);
      toaster('User deleted', {type: 'done'});
      users = users.filter(row => row != user)
    }
    catch (err) {
      console.error(err);
      toaster(`Error deleting user: ${err.message}`, {type: 'error'});
    }
    
  };

  const roles: Role[] = ["ADMIN", "CONTENT_MANAGER", "USER"];

</script>

<div class="container">

  <div class="title">
    <a href="/cms">
      <svg class="arrow-back" viewBox="0 0 12 20">
        <path d="M1.1814 19L9.81849 10L1.1814 1" />
      </svg>
    </a>
    <h1>Users</h1>

    <button class="new-user">
      <div>
        <svg width="77" height="75">
          <path d="M 38.5 38.5 C 42.3291 38.5 46.0013 36.9789 48.7089 34.2714 C 51.4164 31.5638 52.9375 27.8916 52.9375 24.0625 C 52.9375 20.2334 51.4164 16.5612 48.7089 13.8536 C 46.0013 11.1461 42.3291 9.625 38.5 9.625 C 34.6709 9.625 30.9987 11.1461 28.2911 13.8536 C 25.5836 16.5612 24.0625 20.2334 24.0625 24.0625 C 24.0625 27.8916 25.5836 31.5638 28.2911 34.2714 C 30.9987 36.9789 34.6709 38.5 38.5 38.5 Z M 48.125 24.0625 C 48.125 26.6152 47.1109 29.0634 45.3059 30.8684 C 43.5009 32.6734 41.0527 33.6875 38.5 33.6875 C 35.9473 33.6875 33.4991 32.6734 31.6941 30.8684 C 29.8891 29.0634 28.875 26.6152 28.875 24.0625 C 28.875 21.5098 29.8891 19.0616 31.6941 17.2566 C 33.4991 15.4516 35.9473 14.4375 38.5 14.4375 C 41.0527 14.4375 43.5009 15.4516 45.3059 17.2566 C 47.1109 19.0616 48.125 21.5098 48.125 24.0625 Z M 67.375 62.5625 C 67.375 67.375 62.5625 67.375 62.5625 67.375 H 14.4375 C 14.4375 67.375 9.625 67.375 9.625 62.5625 C 9.625 57.75 14.4375 43.3125 38.5 43.3125 C 62.5625 43.3125 67.375 57.75 67.375 62.5625 Z M 62.5625 62.5433 C 62.5577 61.3594 61.8214 57.7981 58.5585 54.5352 C 55.4207 51.3975 49.5158 48.125 38.5 48.125 C 27.4794 48.125 21.5793 51.3975 18.4415 54.5352 C 15.1786 57.7981 14.4471 61.3594 14.4375 62.5433 H 62.5625 Z" stroke-width="1.5"/>
        </svg>
      </div>
      <p>NEW USER</p>
    </button>
 
  </div>

  <div class="users">
    {#each users as user}
      <div>
        <EditableUserImage bind:user={user} />
      </div>
      <div data-id={user.id}>
        <input type="text" value={user.name} on:change={ evt => onChangeName(user, evt.currentTarget.value)}/>
      </div>
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
      <div>
        <button on:click|once={() => onClickDeleteUser(user)} class="delete-user">
          <svg width="25" height="25">
            <path d="M 6.03571 0.789732 C 6.27679 0.305714 6.77232 0 7.3125 0 H 12.6875 C 13.2277 0 13.7232 0.305714 13.9643 0.789732 L 14.2857 1.42857 H 18.5714 C 19.3616 1.42857 20 2.0683 20 2.85714 C 20 3.64598 19.3616 4.28571 18.5714 4.28571 H 1.42857 C 0.639732 4.28571 0 3.64598 0 2.85714 C 0 2.0683 0.639732 1.42857 1.42857 1.42857 H 5.71429 L 6.03571 0.789732 V 0.789732 Z M 17.625 20.808 C 17.5536 21.9777 16.6205 22.8571 15.4866 22.8571 H 4.51339 C 3.3817 22.8571 2.44509 21.9777 2.37455 20.808 L 1.38839 5.71429 H 18.5714 L 17.625 20.808 Z" stroke-width="1.5"></path>
          </svg>
        </button>
      </div>
      
    {/each}
  </div>
</div>

<style lang="stylus">

  .container {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem 6rem;
    margin: 0px auto;
  }

  .users {
    margin-top: 80px;
    typography: ui;
    display: grid;
    font-size: 20px;
    grid-template-columns: 100px 1.25fr 1.25fr 1.25fr 0.25fr;
    row-gap: 30px;

    > * {
      display: flex;
      align-items: center;
      border-bottom: solid 3px #F5F5F5;
      padding-bottom: 10px;
    }

    select {
      padding: 1rem;
      width: 249px;
      background-color: $colors.neutral-bg;
      border: none;
      border-radius: 10px;
      typography: ui;

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
    typography: h2-responsive;
  }

  .title {
    display: flex;
    align-items: center;
    column-gap: 30px;
    margin-bottom: 20px;
    --ib-hover-border: 1px solid #ddd;

    .arrow-back {
      width: 10px;
      fill: none;
      transform: rotate(180deg);
      path {
        stroke: $colors.neutral-black ;
        stroke-width: 2.4px;
      }
    }

    .new-user {
      text-align: center;
      background: white;
      border: none;
      border-radius: 24px;
      box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1); 
      width: 200px;
      height: 140px;

      position: absolute;
      right: 100px;
      margin-top: 80px;

      p {
        margin: 0;
        typography: h4-light;
        color: black;
      }

      &:hover{
        background: $colors.neutral-light;
      }

      svg {
        margin-top: 20px;
        transform: scale(0.85);
      }
    }
  }
</style>