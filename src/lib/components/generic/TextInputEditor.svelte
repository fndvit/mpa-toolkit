<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import EditableContent from "$lib/components/generic/EditableContent.svelte";
  import IconButton from "$lib/components/generic/IconButton.svelte";

  export let value: string;
  export let editable = true;

  const dispatch = createEventDispatcher<{save: string, cancel: null}>();

  let editValue = value;

  type ButtonHandlers = 'edit' | 'save' | 'cancel';
  const handlers: { [key in ButtonHandlers]: svelte.JSX.MouseEventHandler<HTMLElement> } = {
    save: e => {
      e.stopPropagation();
      value = editValue;
      dispatch('save', value);
    },
    cancel: e => {
      e.stopPropagation();
      dispatch('cancel');
    },
    edit: e => {
      e.stopPropagation();
      editValue = value;
    }
  };

</script>

{#if !editable}
  <div>{value}</div>
{:else}
  <EditableContent bind:value={editValue} type='number' editable/>
  {#if editValue !== value}
    <IconButton icon='done' on:click={handlers.save} disabled={!editValue} />
    <IconButton icon='close' on:click={() => editValue = value} />
  {/if}
{/if}
