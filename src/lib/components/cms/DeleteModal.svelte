<script lang="ts">
  import { closeModal } from 'svelte-modals';

  export let title: string;
  export let message: string;
  export let isOpen: boolean;
  export let confirmText: string = null;
  export let onYes: () => void;

  let currentText: string = null;

  const resetErrorField = (e: HTMLInputElement) => {
    e.value = '';
  };

  async function onClickDelete() {
    if(confirmText === currentText || !confirmText) {
      onYes();
      closeModal();
  }

</script>

{#if isOpen}
<div role="dialog" class="modal">
  <div class="contents">
    <h2>{title}</h2>
    <p>{message}</p>
    {#if confirmText}
      <p>Write <b>{confirmText}</b> to confirm</p>
      <input
        type="text"
        placeholder="Confirm text"
        on:keyup={(e) => {currentText = e.currentTarget.value}}
        on:focus={(e) => resetErrorField(e.currentTarget)}
      />
    {/if}
    <div class="actions">
      <button on:click="{closeModal}">Cancel</button>
      <button on:click="{onClickDelete}" disabled={confirmText !== currentText}>Delete</button>
    </div>
  </div>
</div>
{/if}

<style lang="stylus">
  .modal {
    position: fixed;
    z-index: modal;
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

  p {
    text-align: center;
    margin-top: 16px;
  }

  .actions {
    margin-top: 32px;
    display: flex;
    justify-content: flex-end;
  }

</style>