<script lang="ts">
  import * as api from '$lib/api';
  import { IconButton } from '$lib/components/generic';
  import { createEventDispatcher } from 'svelte';

  export let title: string;

  const dispatch = createEventDispatcher<{ uploaded: string; error: string; uploading: null }>();

  let inputEl: HTMLInputElement;

  const onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = () => {
    inputEl.click();
  };

  const onChangeFile: svelte.JSX.ChangeEventHandler<HTMLInputElement> = async e => {
    const { files } = e.currentTarget;
    if (files.length) {
      try {
        dispatch('uploading');
        const url = await api.image.upload(files[0]);
        dispatch('uploaded', url);
      } catch (err) {
        dispatch('error', err.message);
      } finally {
        inputEl.value = '';
      }
    }
  };
</script>

<IconButton on:click={onClick} icon="image" {title} />

<input bind:this={inputEl} style="display: none;" type="file" on:change={onChangeFile} accept=".jpg,.png" />
