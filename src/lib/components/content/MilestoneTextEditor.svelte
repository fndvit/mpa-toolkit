<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import IconButton from "../IconButton.svelte";

  export let text: string;
  export let deletable = false;

  let editText = text;

  const dispatch = createEventDispatcher<{save: string, cancel: null, delete: null}>();

  type ButtonHandlers = 'save' | 'cancel' | 'delete';
  const handlers: { [key in ButtonHandlers]: svelte.JSX.MouseEventHandler<HTMLButtonElement> } = {
    save: e => {
      e.stopPropagation();
      dispatch("save", editText);
    },
    cancel: e => {
      e.stopPropagation();
      dispatch('cancel');
    },
    delete: e => {
      e.stopPropagation();
      dispatch('delete');
    }
  };

</script>

<textarea bind:value={editText} rows="5" />
<div class="editor-controls">
  <IconButton icon='done' on:click={handlers.save} disabled={editText === ''} />
  {#if text !== ''}
    <IconButton icon='close' on:click={handlers.cancel} />
  {/if}
  {#if deletable}
    <IconButton icon='delete' on:click={handlers.delete} />
  {/if}
</div>

<style lang="scss">
  textarea {
    width: 100%;
  }
  .editor-controls {
    display: flex;
    column-gap: 5px;
  }
</style>