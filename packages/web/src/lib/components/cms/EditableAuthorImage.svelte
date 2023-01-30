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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="editable-user-image" on:click={() => inputEl.click()}>
  {#if saving}
    <div class="loading">
      <Spinner />
    </div>
  {/if}
  <AuthorImage {author} />
  <input bind:this={inputEl} style="display: none;" type="file" on:change={onChangeFile} accept=".jpg,.png" />
</div>

<style lang="postcss">
  .editable-user-image {
    position: relative;
    font-size: 0;
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;

    &:hover {
      &::after {
        content: 'upload';
        color: #000;
        font-family: 'Material Icons';
        font-size: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(255 255 255 / 70%);
      }
    }
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
</style>
