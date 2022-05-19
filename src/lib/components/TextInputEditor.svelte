<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import EditableContent from "./EditableContent.svelte";
  import IconButton from "./IconButton.svelte";

  export let value: string;
  export let type: 'text' | 'number' | 'textarea' = "text";
  export let editable = true;

  const dispatch = createEventDispatcher<{save: string, cancel: null}>();

  let editing = value === '';
  let editValue = value;

  type ButtonHandlers = 'edit' | 'save' | 'cancel';
  const handlers: { [key in ButtonHandlers]: svelte.JSX.MouseEventHandler<HTMLElement> } = {
    save: e => {
      e.stopPropagation();
      value = editValue;
      editing = false;
      dispatch('save', value)
    },
    cancel: e => {
      e.stopPropagation();
      editing = false;
      dispatch('cancel');
    },
    edit: e => {
      e.stopPropagation();
      editing = true;
      editValue = value;
    }
  };

  function typeAction(node: HTMLInputElement) {
    node.type = type;
  }

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
