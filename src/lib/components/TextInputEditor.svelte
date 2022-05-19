<script lang="ts">
  import { createEventDispatcher } from "svelte";
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
  {#if !editing}
    <div on:click={handlers.edit}>{value}</div>
  {:else}
    {#if type === 'textarea'}
      <textarea bind:value={editValue} rows="5" />
    {:else}
      <input class="hide-controls" use:typeAction bind:value={editValue} on:keydown={e => e.stopPropagation()} />
    {/if}
    <IconButton icon='done' on:click={handlers.save} disabled={!editValue} />
    {#if value}
      <IconButton icon='close' on:click={handlers.cancel} />
    {/if}
  {/if}
{/if}
