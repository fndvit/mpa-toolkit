<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { IconButton } from '../generic';
  import * as api from '$lib/api';

  const dispatch = createEventDispatcher<{ save: { label: string; url: string } }>();

  let inputEl: HTMLInputElement;

  async function onChange(file: File) {
    const url = await api.asset.upload(file);
    inputEl.value = '';
    dispatch('save', { label: '', url });
  }
</script>

<div class="add-resource-button">
  <IconButton icon="add" on:click={() => inputEl.click()} />
  <input type="file" bind:this={inputEl} on:change={e => onChange(e.currentTarget.files[0])} />
</div>

<style lang="stylus">

  input[type=file] {
    display: none;
  }

  .add-resource-button {
    :global(.icon-button) {
      height: 50px;
      --ib-icon-size: 1.25rem;
      --ib-color: black;
    }
  }

</style>
