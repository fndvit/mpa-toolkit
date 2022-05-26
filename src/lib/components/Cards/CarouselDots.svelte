<script lang="ts">
  import Dot from './Dot.svelte';

  export let progress = false;
  export let pagesCount = 1;
  export let currentPageIndex = 0;
</script>

<div class="sc-carousel-dots__container">
  {#each Array(pagesCount) as _, i}
    <div class="sc-carousel-dots__dot-container">
      <Dot
        {progress}
        on:click={() => currentPageIndex = i}
        active={currentPageIndex === i}
        on:progressAnimationFinished={() => currentPageIndex = i >= pagesCount - 1 ? 0 : i + 1}
      />
    </div>
  {/each}
</div>

<style>
  .sc-carousel-dots__container {
    --dot-size: 10px;
    --dot-color: black;
    --dot-bar-width: 200px;
    --dot-fade: 0.25;
    --dot-progress-duration: 10s;
    display: flex;
    align-items: center;
    padding: 10px 30px;
  }
  .sc-carousel-dots__dot-container {
    height: calc(var(--dot-size) + 14px);
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
  }
</style>
