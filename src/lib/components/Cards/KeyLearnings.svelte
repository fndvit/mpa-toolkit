<script lang="ts">
  import type { KeyLearningsData } from '$lib/types';
  import Cards, { CardData } from './Cards.svelte';
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import EditableText from "../generic/EditableText.svelte";

  export let keyLearnings: KeyLearningsData[] = [];
  export let currentSubject = 0;
  export let editable = false;

  let currentCard = 0;
  let isTimerActive = true;

  const generateCards = () => {
    let newCards = [];
    keyLearnings.forEach(k => {
      let ca = k.body.map(c=> ({
        heading: null,
        body: c
      }));
      newCards.push(ca);
    });
    return newCards;
  };

  let cards: CardData[][] = generateCards();

  const updateKeyLearnings = (cards: CardData[][]) => {
    let newKeyLearnings: KeyLearningsData[] = [];
    for (let c = 0; c < cards.length; c++) {
      let k: KeyLearningsData = {subject: keyLearnings[c].subject, body: []};
      cards[c].forEach(b => {
        k.body.push(b.body);
      });
      newKeyLearnings.push(k);
    }
    return newKeyLearnings;
  };

  const onClickChangeSubject = (n: number) => {
    if (n !== currentSubject) {
      isTimerActive = false;
      setTimeout(() => isTimerActive = true, 100);
      currentSubject = n;
      currentCard = 0;
    }
  };

  const onClickAddKeyLearning = () => {
    let newKeyLearnings: KeyLearningsData = {subject: "", body: ["Enter your text here."]};
    keyLearnings = [...keyLearnings, newKeyLearnings];
    let newSubject = [];
    let newCard = { heading: "", body: "Enter your text here." };
    newSubject.push(newCard);
    cards.push(newSubject);
    keyLearnings = updateKeyLearnings(cards);
    onClickChangeSubject(keyLearnings.length-1);
  };

  const onClickRemoveKeyLearning = (i: number) => {
    if (keyLearnings.length > 1){
      keyLearnings.splice(i, 1);
      cards.splice(i, 1);
      cards = cards;
      onClickChangeSubject(0);
    }
  };

  if (keyLearnings.length === 0) {
    onClickAddKeyLearning();
  }

  $: keyLearnings = updateKeyLearnings(cards);

</script>

<div class="container">
  <div class="card">
    <div class="navigation-menu">
      <div class="titles-area">
        {#each keyLearnings as k, i}
          <div class="title" id={i.toString()} class:selected={i===currentSubject} on:click={() => onClickChangeSubject(i)}>
            <EditableText bind:value={k.subject} {editable} placeholder='Key learning...' />
          </div>
        {/each}
        {#if editable}
          <div class="editor-button">
            <IconButton icon="add" on:click={() => onClickAddKeyLearning()} />
            <IconButton icon="delete" disabled={keyLearnings.length === 1}
              on:click={() => onClickRemoveKeyLearning(currentSubject)} />
          </div>
        {/if}
      </div>

      <div class="middle-area">
        <div class="vertical-dots">
          {#each keyLearnings as {}, i}
            <div class="circle" class:selected={i===currentSubject} on:click={() => onClickChangeSubject(i)}/>
          {/each}
        </div>
        <div class="line"/>
      </div>
    </div>

    {#if cards[currentSubject]}
      <div class="card-content no-heading key-learnings">
        <Cards
          bind:cards={cards[currentSubject]}
          canToggleHeading={false}
          progress={isTimerActive}
          removable={false}
          style='no-heading'
          {editable}
          bind:currentPageIndex={currentCard}
        />
      </div>
    {/if}
  </div>
</div>

<style lang="stylus">

  .container {
    display: block;
    position: relative;
    width: 100%;
  }

  .editor-button {
    margin-top: 10px;
    right: 40px;
    display: flex;
    column-gap: 5px;
    justify-content: left;
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
    margin-left: 5px;
    margin-right: 10px;
  }

  .line {
    margin: auto;
    top: 0px;
    height: 100%;
    width: 1px;
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
    padding-left: 30px;
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

  .card {
    display: flex;
    flex-direction: row;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
    border-radius: 20px;
    background-color: $colors.neutral-bg;

    :global(.editable-text) {
      --outline-color: $colors.neutral-black;
      --caret-color: $colors.neutral-black;
    }
  }

  .card-content {
    display: block;
    min-width: 0;

    :global(.cards){
      //height: 100%;
    }

    :global(.splide){
      //height: 100%;
    }

    :global(.content){
      padding-top: 0px !important;
      //height: 100%;
    }

    //:global(.card-bottom) {
      //position: absolute;
      //width: 100%;
      //bottom: 0;
    //}
  }


  +breakpoint(page, medium) {

    .navigation-menu {
      flex-direction: column;
      max-width: none;
    }

    .titles-area {
      display: flex;
      flex-direction: row;
      width: auto;
      column-gap: 15px;
      padding: 20px 0px 10px 0px;
      flex-wrap: nowrap;
      overflow-x: scroll;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      border-left: 30px solid $colors.neutral-bg;
      border-right: 30px solid $colors.neutral-bg;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .middle-area {
      flex-direction: row;
      padding: 15px 0px 0px 0px;
      margin-right: 0px;
    }

    .vertical-dots {
      height: 10px;
      width: auto;
      flex-direction: row;
      column-gap: 7px;
      padding-left: 25px;
      padding-right: 10px;
      z-index: 10;
    }

    .title {
      white-space: nowrap;
    }

    .card {
      flex-direction: column;
      background-color: $colors.neutral-bg;
    }

    .line {
      margin: auto;
      height: 1px;
      width: 100%;
      transform: translateY(-5px);
    }

  }

</style>
