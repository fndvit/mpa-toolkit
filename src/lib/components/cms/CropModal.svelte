<script lang="ts" context="module">
  export type CropEvent = {
      file: File;
    };
</script>

<script lang="ts">

  import { fromImage } from 'imtool';
  import { closeModal } from 'svelte-modals';
  import LocalFileCrop from './LocalFileCrop.svelte';

  export let isOpen: boolean;
  export let file: File;
  export let onCrop: (file: File) => void;

  let croppedImg: string;
  let croppedFile: File;
  let cropData: Cropper.Data;

  async function onClickCrop() {
    const imtool = await fromImage(file);
    const { x, y, width, height } = cropData;
    const cropped = imtool
      .crop(x, y, width, height)
      .thumbnail(66);
    croppedImg = await cropped.toBlobURL();
    croppedFile = await cropped.toFile('cropped.jpg');
  }

  async function onClickSave() {
    onCrop(croppedFile);
    closeModal();
  }

</script>

{#if isOpen}
<div role="dialog" class="modal">
  <div class="contents">
    <h2>Crop</h2>
    <div class="crop-container">
      {#if croppedImg}
        <img class="cropped-image" src={croppedImg} alt="crop" />
        <div class="buttons">
          <button on:click={() => croppedImg = null}>Back</button>
          <button on:click={onClickSave}>Save</button>
        </div>
      {:else}
        <LocalFileCrop {file} bind:cropData />
        <div class="buttons">
          <button on:click={onClickCrop}>Crop</button>
        </div>
      {/if}
    </div>
  </div>
</div>
{/if}

<style lang="scss">
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }

  .contents {
    min-width: 240px;
    border-radius: 6px;
    padding: 16px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
  }

  h2 {
    text-align: center;
    font-size: 24px;
  }

  .crop-container {
    z-index: 1;
    max-width: 400px;
    display: flex;
    align-items: center;
    flex-direction: column;
    row-gap: 20px;
  }
  .buttons {
    display: flex;
    width: 100%;
    column-gap: 5px;
    > * {
      flex: 1;
      padding: 10px;
    }
  }

  .cropped-image {
    border-radius: 50%;
  }
</style>