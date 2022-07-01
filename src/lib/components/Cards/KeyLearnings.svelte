<script lang="ts" context="module">

  export type KeyLearningsData = {
    subject: string;
    body: string[];
  }

</script>

<script lang="ts">
  import Cards from './Cards.svelte';
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import EditableText from "../generic/EditableText.svelte";

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
  export let editable = true;

  let slideIndex: number = 0;
  let isTimerActive = true;

  $: slides = cards[currentSubject].body.map(c=> ({
    heading: null,
    body: c
  }));

  const onClickChangeSubject = (n: number) => {
    isTimerActive = false;
    setTimeout(() => {isTimerActive = true}, 100);
    currentSubject = n;
    slideIndex = 0;
  }

  const onClickAddKeyLearning = () => {
    let newKeyLearning: KeyLearningsData = {subject: '', body: ['']}
    cards = [...cards, newKeyLearning];
  }

</script>


<div class="container">
  <div class="card">
    <div class="navigation-menu">
      <div class="titles-area">
        {#each cards as card, i}
          <div class="title" class:selected={i===currentSubject} on:click={() => onClickChangeSubject(i)}>
            <EditableText bind:value={card.subject} {editable} placeholder='Key learning...' />
          </div>
        {/each}
        {#if editable}
          <div class="editor-button">
            <IconButton icon="add" on:click={onClickAddKeyLearning} />
          </div>
        {/if}
      </div>

      <div class="middle-area">
        <div class="vertical-dots">
          {#each cards as {}, i}
            <div class="circle" class:selected={i===currentSubject} on:click={() => onClickChangeSubject(i)}/>
          {/each}
        </div>
        <div class="line"/>
      </div>

    </div>
    <div class="card-content no-heading">
      <Cards cards={slides} progress={isTimerActive} style='no-heading' {editable} bind:currentPageIndex={slideIndex}/>
    </div>

  </div>
</div>


<style lang="stylus">

  .editor-button {
    margin-top: 10px;
    :global(.icon-button) {
      --ib-icon-bg: #00000022;
      --ib-hover-bg: #00000022;
      --ib-hover-border-color: #00000022;
      --ib-active-bg: #ffffff77;
    }
  }

  .middle-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40px;
    margin-left: 10px;
  }

  .line {
    margin: auto;
    top: 0px;
    height: 100%;
    width: 1.25px;
    background-color: $colors.neutral-light;
  }

  .circle {
    height: 7px;
    width: 7px;
    background-color: black;
    border-radius: 100%;
    opacity: 0.25;
    cursor: pointer;
    z-index: 2;
    box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.15);

    &.selected {
      opacity: 1;
    }
  }

  .circle:hover {
    opacity: 0.5;
  }

  .vertical-dots {
    position: absolute;
    width: 10px;
    align-items: center;
    display: flex;
    flex-direction: column;
    row-gap: 7px;
    flex-grow: 0;
    margin: auto;
    background-color: $colors.neutral-bg;
    padding-bottom: 10px;
  }

  .navigation-menu {
    max-width: 220px;
    display: flex;
  }

  .titles-area {
    padding-left: 25px;
    padding-top: 35px;
    padding-bottom: 35px;
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
    grid-config(page, test);


    :global(.editable-text) {
      --outline-color: $colors.neutral-black;
      --caret-color: $colors.neutral-black;
    }
  }

  .card {
    grid-area: keylearnings;
    display: flex;
    background-color: $colors.neutral-bg;
    border-radius: 20px;
  }

  .card-content {

    :global(.cards){
      width: 100%;
      background-color: $colors.neutral-bg;
      box-shadow: none;
      height: 100%;
    }

    :global(.splide){
      height: 100%;
      margin-bottom: 100px;
    }

    :global(.card-bottom){
      position: absolute;
      width: 100%;
      bottom: 0;

    }

    :global(.content){
      padding-top: 0px !important;
    }
  }

</style>
