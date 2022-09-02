<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as api from '$lib/api';

  const dispatch = createEventDispatcher<{ save: { label: string; url: string } }>();

  let inputEl: HTMLInputElement;
  let label: string;

  async function onSubmit() {
    const url = await api.asset.upload(inputEl.files[0]);
    dispatch('save', { label, url });
  }
</script>

<form on:submit|preventDefault={onSubmit} class="diagram-resource-editor">
  <div>
    <input type="text" bind:value={label} placeholder="Name" />
    <input type="file" bind:this={inputEl} />
  </div>
  <input type="submit" class="button" value="ADD" />
</form>

<style lang="stylus">

  .diagram-resource-editor {
    margin: 10px 0;

    input[type="text"] {
      border: none;
      text-decoration: none;
      margin: 10px;

      &:focus {
        outline: none;
        border-bottom: solid 1px;
      }
    }

    .button {
      border: none;

      margin: 10px;
      padding: 10px 15px;
      border-radius: 5px;

      &:hover {
        filter: brightness(105%);
      }
    }
  }

</style>
