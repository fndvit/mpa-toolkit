<script lang="ts">
  import type { Author } from '@mpa/db';
  import { openModal } from 'svelte-modals';
  import AuthorImage from './AuthorImage.svelte';
  import CropModal from './CropModal.svelte';
  import * as api from '$lib/api';
  import { Spinner } from '$lib/components/generic';

  export let author: Author.ForCMS;

  let inputEl: HTMLInputElement;
  let file: File;
  let saving = false;

  async function onCrop(file: File) {
    saving = true;
    const img = await api.image.upload(file);
    await api.author.update(author.id, { img });
    saving = false;
    author.img = img;
  }

  const onChangeFile: svelte.JSX.ChangeEventHandler<HTMLInputElement> = async e => {
    const { files } = e.currentTarget;
    file = files[0];
    openModal(CropModal, { file, onCrop });
  };
</script>

<div class="editable-user-image">
  {#if saving}
    <div class="loading">
      <Spinner />
    </div>
  {/if}
  <AuthorImage on:click={() => inputEl.click()} {author} />
  <input bind:this={inputEl} style="display: none;" type="file" on:change={onChangeFile} accept=".jpg,.png" />
</div>

<style lang="postcss">
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
    background: #2226;
    border-radius: 50%;
  }

  :global(.user-image) {
    cursor: pointer;

    &:hover {
      filter: brightness(95%);
    }
  }
</style>
