<script lang="ts" context="module">
  export type KeyLearningsData = {
    subject: string;
    body: string[];
  }
</script>

<script lang="ts">
  import CarouselDots from './CarouselDots.svelte';
  import Cards from './Cards.svelte';

  const example_card: KeyLearningsData[] = [ { subject: "What is needed", body: ['Budget efficiencies through use of technology','Effective local partnerships', 'Community engagement'] },
  { subject: "What doesn't work", body: ['Budget efficiencies through use of technology 2','Effective local partnerships 2', 'Community engagement 2'] },
  { subject: "What works", body: ['Budget efficiencies through use of technology 3','Effective local partnerships 3', 'Community engagement 3'] } ];

  export let cards: KeyLearningsData[] = example_card;
  export let currentSubject = 0;
  export let editable = false;

  let slideIndex: number = 0;

  $: selectedCards = cards[currentSubject].body.map(c=> ({
    heading: null,
    body: c
  }));

  $: if (currentSubject) slideIndex = 0;

  const onClickChangeSubject = (n: number) => {
    currentSubject = n;
  }

  const onClickAddKeyLearning = () => {

  }

</script>


<div class="container">
  <div class="card">
    <div class="navigation-menu">
      <div class="titles-area">
        {#each cards as card, i}
          <div class="title" class:selected={i===currentSubject} on:click={() => onClickChangeSubject(i)}>
            {card.subject}
          </div>
        {/each}
      </div>

      <div class="vertical-dots">
        <CarouselDots
          bind:currentPageIndex={currentSubject}
          pagesCount={cards.length}
          progress={false}
        />
      </div>

    </div>
    <div class="card-content">
      <Cards cards={selectedCards} bind:currentPageIndex={slideIndex}/>
    </div>

  </div>
</div>



<style lang="stylus">

  .navigation-menu {
    display: flex;
    width: 219px;
  }

  .vertical-dots {
    :global(.carousel-dots) {
      transform: rotate(90deg);
    }
  }

  .title {
    cursor: pointer;
    color: red;

    &.selected {
      color: blue;
    }
  }

  .container {
    background-color: $colors.neutral-light;
  }

  .card {
    display: flex;
    background-color: $colors.neutral-bg;
    max-width: 957px;
  }

  .card-content {
    :global(.cards){
      background-color: transparent;
      box-shadow: none;
    }
  }

  .carousel-dots {

  }

</style>
