<script lang="ts">
  import { closeModal } from 'svelte-modals';

  export let isOpen: boolean;
  export let onYes: () => void;

  async function onClickDelete() {
    onYes();
    closeModal();
  }

</script>

{#if isOpen}
<div role="dialog" class="modal">
  <div class="contents">
    <h2>Delete page</h2>
    <p>Are you sure you want to delete this page?</p>
    <div class="actions">
      <button on:click="{closeModal}">Cancel</button>
      <button on:click="{onClickDelete}">Delete</button>
    </div>
  </div>
</div>
{/if}

<style lang="stylus">
  .modal {
    position: fixed;
    z-index: 10;
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