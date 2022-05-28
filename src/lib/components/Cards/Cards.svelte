<script lang="ts" context="module">
  export type CardData = {
    heading: string;
    body: string;
  }
</script>

<script lang="ts">
  import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
  import CarouselDots from './CarouselDots.svelte';
  import CardHeading from './CardHeading.svelte';
  import CardBody from './CardBody.svelte';
  import { SplideOptions } from '$lib/helpers/splide';
  import IconButton from '$lib/components/generic/IconButton.svelte';


  export let cards: CardData[];
  export let currentPageIndex = 0;
  export let editable = false;
  export let fixedTitle: string = null;
  export let selected = false;

  let splide: Splide;

  let options = SplideOptions({
    rewind: true,
    autoHeight: true,
    autoplay: !editable,
    gap: -3,
    pagination: false
  });

  const onClickAddCard = () => {
    cards.push({heading: '', body: ''});
    cards = cards;
    window.setTimeout(() => splide.go(cards.length - 1));
  };

  const onClickRemoveCard = () => {
    cards = cards.filter((_, i) => i !== currentPageIndex);
    const goTo = Math.max(0, Math.min(currentPageIndex, cards.length-1));
    splide.go(goTo);
  };

  $: if (currentPageIndex >= 0 && splide) splide.go(currentPageIndex);
</script>

<div class="cards" class:has-fixed-title={fixedTitle} class:selected>
  <Splide {options} bind:this={splide} on:move={e => currentPageIndex = e.detail.index} hasTrack={false}>
    {#if fixedTitle}
      <div class="fixed-title">
        <CardHeading text={fixedTitle } />
      </div>
    {/if}
    <SplideTrack>
      {#each cards as card, i}
        <SplideSlide>
          <div class="slide">
            <CardHeading bind:text={card.heading} editable={editable && currentPageIndex === i} />
            <CardBody bind:text={card.body} editable={editable && currentPageIndex === i} />
          </div>
        </SplideSlide>
      {/each}
    </SplideTrack>
    {#if editable}
      <div class="editor-buttons">
        <IconButton icon="add" on:click={onClickAddCard} />
        <IconButton icon="delete" on:click={onClickRemoveCard} />
      </div>
    {/if}
    {#if editable || cards.length > 1}
      <div class="carousel-dots">
        <CarouselDots
          bind:currentPageIndex
          pagesCount={cards.length}
          progress={!editable}
        />
      </div>
    {/if}
  </Splide>
</div>

<style type="scss">

  .cards {
    --content-padding: 30px;
    --content-top-padding: 30px;
    --scrollbar-width: 10px;
    --caret-color: #333;
    border-radius: 15px;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);

    background-color: #fbe26b;
    color: #333;

    :global(.splide__arrows) {
      position: absolute;
      right: 24px;
      top: 44px;
      display: flex;
      column-gap: 10px;;
    }

    :global(.splide__arrow) {
      position: static;
      background: transparent;
    }
    :global(.splide__arrow:disabled) {
      display: none;
    }
  }

  .editor-buttons {
    position: absolute;
    right: 40px;
    display: flex;
    column-gap: 5px;
    justify-content: right;
    :global(.icon-button) {
      --ib-icon-bg: #00000022;
      --ib-hover-bg: #00000022;
      --ib-hover-border-color: #00000022;
    }
  }

  .carousel-dots {
    padding-bottom: 20px;
  }

  .cards :global(.splide__track) {
    border-radius: 15px;
  }

  .slide {
    overflow: hidden;
    font-family: 'Montserrat';
    top: 0;
    padding: var(--content-top-padding) var(--content-padding) 10px;
    margin-bottom: 15px;
    .has-fixed-title & :global(.heading) {
      visibility: hidden;
    }
  }

  .fixed-title {
    :global(.heading) {
      margin-left: var(--content-padding);
      margin-top: var(--content-top-padding);
      position: absolute;
    }
  }
</style>
