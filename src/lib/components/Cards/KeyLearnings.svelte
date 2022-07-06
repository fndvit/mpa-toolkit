<script lang="ts">
  import type { KeyLearningsData } from '$lib/types';
  import Cards from './Cards.svelte';
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import EditableText from "../generic/EditableText.svelte";

  const example_card: KeyLearningsData[] = [ { subject: "What is needed", body: ['Mauris et metus sed mauris mattis tempor. Nulla pellentesque, diam in tincidunt consequat, nunc eros volutpat eros, eget rutrum urna nisl eu nunc.','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et metus sed mauris mattis tempor. Nulla pellentesque, diam in tincidunt consequat, nunc eros volutpat eros. Mauris et metus sed mauris mattis tempor. Nulla pellentesque, diam in tincidunt consequat, nunc eros volutpat eros. Sed elementum tempus odio at rutrum. Phasellus commodo neque eget tristique iaculis. Mauris quis mattis risus.', 'Mauris et metus sed mauris mattis tempor. Nulla pellentesque, diam in tincidunt consequat, nunc eros volutpat eros, eget rutrum urna nisl eu nunc. Aliquam a ullamcorper mauris. Nullam bibendum ut odio eget aliquet. Sed pretium malesuada sapien vel facilisis. Donec eu enim est.'] },
  { subject: "What doesn't work", body: ['Quisque odio justo, porttitor et tincidunt nec, rutrum id felis. Vestibulum pulvinar volutpat ullamcorper. Mauris gravida purus eget lorem interdum vulputate. ','Maecenas id lacinia lectus, vel pharetra est. Vivamus sodales ipsum vel dictum porttitor. ', 'In sit amet dapibus arcu. Vestibulum nec mattis metus. Ut maximus id massa faucibus suscipit. Ut ut ornare arcu, id vestibulum urna.'] },
  { subject: "What works", body: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum tempus odio at rutrum. Phasellus commodo neque eget tristique iaculis. Mauris quis mattis risus. Proin lacinia eu lacus ac euismod. ',' Mauris nec vestibulum nulla. Nam eu odio vel tellus condimentum faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.', 'Vestibulum quis urna nec odio ultricies blandit viverra imperdiet magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'] },
  { subject: "What could work", body: ['Aenean eu turpis rhoncus, placerat urna ac, molestie arcu. Morbi tristique lectus eu sapien suscipit, ut pretium tortor accumsan. In ultrices nulla eu lacinia tempus.','Phasellus interdum mauris sit amet ipsum tincidunt aliquet. Vestibulum non varius nunc. Curabitur in mi ac justo luctus convallis.', 'Nullam bibendum ut odio eget aliquet. Sed pretium malesuada sapien vel facilisis. Donec eu enim est.'] },
  { subject: "What will not work", body: ['Sed placerat urna euismod accumsan volutpat. Nulla eu libero purus. Aliquam semper libero in ante lacinia, interdum volutpat felis malesuada.','Vivamus fermentum ultricies lorem ac convallis. Sed placerat urna euismod accumsan volutpat. Nulla eu libero purus. Aliquam semper libero in ante lacinia, interdum volutpat felis malesuada. ', 'Aliquam semper libero in ante lacinia, interdum volutpat felis malesuada. Nullam porta neque felis, at ultrices felis accumsan sit amet. Curabitur nec est enim.'] },
  { subject: "What you will do", body: [' Ut maximus id massa faucibus suscipit. Ut ut ornare arcu, id vestibulum urna. Praesent porttitor nisl in suscipit dignissim.','Nunc quis volutpat mi, at tincidunt ex. Proin feugiat suscipit tortor, at dignissim felis pharetra at. ', 'Phasellus luctus odio vitae velit aliquam consequat. Nulla non lorem semper risus commodo elementum in a nunc. Nunc quis volutpat mi, at tincidunt ex.'] },
  { subject: "What you can't do", body: ['Sed lobortis tortor interdum libero mollis venenatis. Phasellus ultrices quam in ex pharetra luctus.','Quisque odio justo, porttitor et tincidunt nec, rutrum id felis. Vestibulum pulvinar volutpat ullamcorper.', 'Morbi tristique lectus eu sapien suscipit, ut pretium tortor accumsan. In ultrices nulla eu lacinia tempus.'] },
  { subject: "What you must do", body: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum tempus odio at rutrum. Phasellus commodo neque eget tristique iaculis. Mauris quis mattis risus.','Vestibulum quis urna nec odio ultricies blandit viverra imperdiet magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Curabitur in mi ac justo luctus convallis. Sed sed mattis mauris, nec viverra leo. Nam vitae purus ante. Curabitur condimentum semper venenatis.'] },
];

  export let cards: KeyLearningsData[] = example_card;
  export let currentSubject = 0;
  export let editable = false;

  let slideIndex: number = 0;
  let isTimerActive = true;

  $: slides = cards[currentSubject].body.map(c=> ({
    heading: null,
    body: c
  }));

  const onClickChangeSubject = (n: number) => {
    if (n !== currentSubject) {
      isTimerActive = false;
      setTimeout(() => {isTimerActive = true}, 100);
      currentSubject = n;
      slideIndex = 0;
    }
  }

  const onClickAddKeyLearning = () => {
    let newKeyLearning: KeyLearningsData = {subject: '', body: ['']}
    cards = [...cards, newKeyLearning];
    onClickChangeSubject(cards.length-1);
  }

  const onClickRemoveKeyLearning = () => {
    cards.splice(currentSubject, 1);
    cards = cards;
    currentSubject = 0;
  }

</script>


<div class="container">
  <div class="card">
    <div class="navigation-menu">
      <div class="titles-area">
        {#each cards as card, i}
          <div class="title" id={i.toString()} class:selected={i===currentSubject} on:click={() => onClickChangeSubject(i)}>
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

    <div class="card-content no-heading key-learnings">
      <Cards cards={slides} handleDeletion={onClickRemoveKeyLearning} progress={isTimerActive} style='no-heading' {editable} bind:currentPageIndex={slideIndex}/>
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
    background-color: $colors.neutral-bg;
    border-radius: 20px 0px 0px 20px;
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

    :global(.editable-text) {
      --outline-color: $colors.neutral-black;
      --caret-color: $colors.neutral-black;
    }
  }

  .card {
    display: flex;
    width: auto;
  }

  .card-content {

    display: block;

    :global(.cards){
      height: 100%;
      width: 750px;
    }

    :global(.splide){
      height: 100%;
    }

    :global(.content){
      padding-top: 0px !important;
      height: 100%;
    }

    :global(.card-bottom) {
      position: absolute;
      width: 100%;
      bottom: 0;
    }
  }


  +breakpoint(page, medium) {

    .card {

    }

    .card-content {


      :global(.cards) {

      }


    }

  }

  +breakpoint(page, small){

  }

</style>
