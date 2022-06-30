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
  { subject: "What works", body: ['Budget efficiencies through use of technology 3','Effective local partnerships 3', 'Community engagement 3'] },
  { subject: "What could work", body: ['Budget efficiencies through use of technology 4','Effective local partnerships 4', 'Community engagement 4'] },
  { subject: "What will not work", body: ['Budget efficiencies through use of technology 5','Effective local partnerships 5', 'Community engagement 5'] },
  { subject: "What you will do", body: ['Budget efficiencies through use of technology 6','Effective local partnerships 6', 'Community engagement 6'] },
  { subject: "What you can't do", body: ['Budget efficiencies through use of technology 7','Effective local partnerships 7', 'Community engagement 7'] },
  { subject: "What you must do", body: ['Budget efficiencies through use of technology 8','Effective local partnerships 8', 'Community engagement 8'] },
];

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

      <div class="middle-area">
        <div class="vertical-dots">
          <CarouselDots
            bind:currentPageIndex={currentSubject}
            pagesCount={cards.length}
            progress={false}
          />
        </div>

        <div class="line"/>

      </div>

    </div>
    <div class="card-content">
      <Cards cards={selectedCards} bind:currentPageIndex={slideIndex}/>
    </div>

  </div>
</div>


<style lang="stylus">

  .middle-area {
    display: flex;
    flex-direction: column;
    width: 50px;
  }

  .line {
    margin: auto;
    top: 0px;
    height: 100%;
    width: 3px;
    background-color: green;
  }

  .navigation-menu {
    max-width: 220px;
    display: flex;
  }

  .vertical-dots {
    height: 100%;
    padding-top: 32.5px;
    background-color: red;
    padding-bottom: 32.5px;
    :global(.carousel-dots) {
      transform: rotate(90deg);
      padding-left: 0px;
    }
  }

  .titles-area {
    padding-left: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    width: 155px;
    typography: ui-small;
    color: black;
  }

  .title {
    cursor: pointer;
    opacity: 0.5;
    line-height: 22px;

    &.selected {
      opacity: 1;
      font-weight: bold;
    }
  }

  .container {
    background-color: $colors.neutral-light;
    padding: 100px;
  }

  .card {
    display: flex;
    background-color: $colors.neutral-bg;
    max-width: 957px;
    border-radius: 20px;
  }

  .card-content {
    :global(.cards){
      background-color: transparent;
      box-shadow: none;
    }
  }

</style>
