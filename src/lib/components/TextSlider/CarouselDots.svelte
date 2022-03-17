<script>
    import Dot from './Dot.svelte';

    export let progress = false;
    export let pagesCount = 1;
    export let currentPageIndex = 0;
    export let color = 'black';
    export let handleDotClick;
  </script>

  <div class="sc-carousel-dots__container">
    {#each Array(pagesCount) as _, pageIndex (pageIndex)}
      <div class="sc-carousel-dots__dot-container">
        <Dot
          progress={progress}
          active={currentPageIndex === pageIndex}
          color={color}
          on:click={handleDotClick(pageIndex)}
          on:progressAnimationFinished={handleDotClick(pageIndex >= pagesCount -1 ? 0 : pageIndex + 1)}
        ></Dot>
      </div>
    {/each}
  </div>

  <style>
    .sc-carousel-dots__container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      padding: 0 30px;
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