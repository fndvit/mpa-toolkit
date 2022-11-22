<div class="content-carousel-card" tabindex="0">
  <div class="img-container">
    <div class="loading-card" />
    <div class="title" />
  </div>

  <div class="tags">
    {#each [1, 2, 3] as _}
      <div class="loading-tag" />
    {/each}
  </div>
</div>

<style lang="stylus">

  .content-carousel-card {
    width: 292px;
    .img-container {
      display: flex;
      flex-direction: column;
      row-gap: 0.6rem;
      padding-bottom: 1rem;
    }
  }

  .tags {
    display: flex;
    justify-content: space-between;
  }

  .loading-tag {
    width: 50px;
    height: 20px;
    background-color: black;
    border-radius: 10px;
  }

  .loading-card {
    height: 148px;
    border-radius: 5px;
  }

  .title {
    height: 30px;
    border-radius: 5px;
  }

  .title, .loading-tag, .loading-card {
    @keyframes shine {
      to {
        background-position-x: -200%;
      }
    }
    background: linear-gradient(110deg, #c3c3c3 15%, #cbcbcb 30%, #c3c3c3 40%);
    background-size: 200% 100%;
    animation: 1.5s shine linear infinite;
  }


  @media (max-width: 1320px) {
    .content-carousel-card {
      max-width: 210px;
    }
  }


</style>
