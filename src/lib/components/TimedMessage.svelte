<script lang="ts">

  let message: string;
  let timeout: number;

  export function showMessage(_message: string, durationMs=5000) {

    if (timeout) {
      window.clearTimeout(timeout);
      timeout = null;
    }

    timeout = window.setTimeout(() => message = timeout = null, durationMs);
    message = _message;
  }

</script>

{#if message}
  <div class="message">
    {message}
  </div>
{/if}


<style>
  .message {
    color: #333;
  }
</style>
