<script lang="ts">
  import { toaster } from '.';
</script>

<div class="toaster">
  {#each $toaster as toast (toast.id)}
    <div class="toast" data-type={toast.type}>
      <div class="material-icons">{toast.type}</div>
      {toast.text}
    </div>
  {/each}
</div>

<style lang="postcss">
  .toaster {
    font: $f-ui-small;
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: $z-toast;
    padding: 10px;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    max-width: 400px;
  }

  @keyframes animate-toast {
    0% {
      transform: translateY(100%);
    }

    100% {
      transform: translateY(0%);
    }
  }

  .toast {
    color: #333;
    border-radius: 5px;
    border: 1px solid #ddd;
    background: $c-neutral-bg;
    padding: 10px 15px 10px 10px;
    display: flex;
    align-items: center;
    column-gap: 10px;
    box-shadow: 0 3px 16px rgb(0 0 0 / 20%);
    animation: animate-toast 100ms;

    &[data-type='error'] .material-icons {
      color: $c-error-red;
    }

    &[data-type='info'] .material-icons {
      color: #666;
    }

    &[data-type='warning'] .material-icons {
      color: #b75d3c;
    }

    &[data-type='done'] .material-icons {
      color: rgb(35 106 47);
    }
  }
</style>
