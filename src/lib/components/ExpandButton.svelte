<script lang="ts">
  export let topic: string;
  export let expanded: boolean;
</script>

<div class="expand-button">
  <div class="internal-container" on:click>
    <svg width="13" height="8" viewBox="0 0 13 8" fill="none" transform="scale(1, {expanded ? -1 : 1})" class="arrow">
      <path d="M0.630249 1L6.36134 6.5L12.0924 1" stroke="#2A2A2A" stroke-width="1.5"/>
    </svg>
    {#if !expanded}
      Learn about the <b>{topic}</b>
    {:else}
      Read less
    {/if}
  </div>
</div>


<style>

  .arrow {
    margin-right: 5px;
  }

  .expand-button {
    border-top: 0.5px solid #D9D9D9;
    width: 640px;
  }

  .internal-container {
    position: relative;
    display: inline-block;
    height: 40px;
    background: #F9F9F9;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
    border-radius: 0px 0px 20px 20px;
    font-size: 12px;
    line-height: 40px;
    font-family: 'Montserrat';
    cursor: pointer;
    text-align: center;
    vertical-align: middle;
    margin-bottom: 40px;
    padding-left: 15px;
    padding-right: 20px;
  }

  .internal-container:hover {
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.30);
  }

</style>
