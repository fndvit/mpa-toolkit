<script lang="ts">
  import Cropper from 'cropperjs';
  import 'cropperjs/dist/cropper.css';
  import { onDestroy, onMount } from 'svelte';

  export let file: File;
  export let cropData: Cropper.Data;

  let cropper: Cropper;
  let imgSrc: string;
  let imgEl: HTMLImageElement;

  const fileToImgSrc = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result.toString());
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  onMount(async () => {
    imgSrc = await fileToImgSrc(file);
  });

  const initCropper = () => {
    cropper = new Cropper(imgEl, {
      viewMode: 2,
      dragMode: 'move',
      aspectRatio: 1,
      ready() {
        if (cropData) cropper.setData(cropData);
        cropData = cropper.getData();
        imgEl.addEventListener('crop', () => (cropData = cropper.getData()));
      }
    });
  };

  onDestroy(() => cropper.destroy());
</script>

<img src={imgSrc} alt="crop" bind:this={imgEl} on:load={initCropper} />

<style lang="stylus">
  img {
    display: block;
    max-width: 80vw;
    max-height: 70vh;
  }

</style>
