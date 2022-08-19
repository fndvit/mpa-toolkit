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

<style lang="stylus">
  .toaster {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: toast;
    padding: 10px;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
  }

  @keyframes animateToast {
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
    border: 1px solid #999;
    background: $colors.neutral-bg;
    padding: 10px 15px 10px 10px;
    display: flex;
    align-items: center;
    column-gap: 5px;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.2);
    animation: animateToast 100ms;

    &[data-type="error"] .material-icons {
      color: $colors.error-red;
    }

    &[data-type="info"] .material-icons {
      color: #666;
    }
    &[data-type="done"] .material-icons {
      color: rgb(35, 106, 47);
    }
  }

</style>
