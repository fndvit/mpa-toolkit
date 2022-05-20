<script lang="ts">
  import { updateUser, uploadImage } from "$lib/api";
  import type { User } from "$lib/types";
  import { openModal } from "svelte-modals";
  import UserImage from "$lib/components/UserImage.svelte";
  import CropModal from "$lib/components/cms/CropModal.svelte";
  import Spinner from "$lib/components/generic/Spinner.svelte";

  export let user: User;

  let inputEl: HTMLInputElement;
  let file: File;
  let saving = false;

  async function onCrop(file: File) {
    saving = true;
    const img = await uploadImage(file);
    user = await updateUser(user.id, { img });
    saving = false;
  }

  const onChangeFile: svelte.JSX.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const { files } = e.currentTarget;
    file = files[0];
    openModal(CropModal, { file, onCrop });
  };

</script>

<div class="editable-user-image">
  {#if saving}
  <div class="loading">
    <Spinner/>
  </div>
  {/if}
  <UserImage on:click={() => inputEl.click()} {user} />
  <input
    bind:this={inputEl}
    style="display: none;"
    type="file"
    on:change={onChangeFile}
    accept=".jpg,.png"
  />
</div>

<style lang="scss">
  .editable-user-image {
    position: relative;
    font-size: 0;
  }
  .loading {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #22222266;
    border-radius: 50%;
    --color: #222;
  }

  :global(.user-image) {
    cursor: pointer;
    &:hover {
      filter: brightness(95%);
    }
  }
</style>