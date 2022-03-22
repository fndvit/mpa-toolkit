<script lang="ts">
  export let block;
</script>

{#if block.content}
  <div class="heading">{block.content[0].text}</div>
{/if}

<style>
  .heading {
    font-size: 16px;
    font-weight: 700;
    height: 25%;
  }
</style>
