<script lang="ts" context="module">

  let idGen: number = 0;
  export function generateID(){
    return idGen++;
  }

  export type CardData = {
    heading: string;
    body: string;
    type: string;
  }

</script>

<script lang="ts">
  import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
  import CarouselDots from './CarouselDots.svelte';
  import CardHeading from './CardHeading.svelte';
  import CardBody from './CardBody.svelte';
  import { SplideOptions } from '$lib/helpers/splide';
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import { getContext } from 'svelte/internal';

  export let cards: CardData[];
  export let currentPageIndex = 0;
  export let editable = false;
  export let fixedTitle: string = null;
  export let selected = false;

  const dataCardsId = generateID();
  console.log(dataCardsId);
  const context = getContext('page-type');

  let cardType: string = cards[currentPageIndex].type;
  let splide: Splide;

  let options = SplideOptions({
    rewind: true,
    autoHeight: true,
    gap: -3,
    pagination: false
  });

  const onClickAddCard = () => {
    cards.push({heading: '', body: '', type: cardType});
    cards = cards;
    window.setTimeout(() => splide.go(cards.length - 1));
  };

  const onClickRemoveCard = () => {
    cards = cards.filter((_, i) => i !== currentPageIndex);
    const goTo = Math.max(0, Math.min(currentPageIndex, cards.length-1));
    splide.go(goTo);
  };

  const onClickChangeType = () => {
    cardType === 'default' ? cardType = 'no-heading' : cardType = 'default';
    cards = cards.map(c => {return {...c, type: cardType}});
    console.log(cards);
  }

  let rootElement;
  $: rootElement && rootElement.style.setProperty('--id-number', dataCardsId);

  $: if (currentPageIndex >= 0 && splide) splide.go(currentPageIndex);

</script>

<div class="cards" class:has-fixed-title={fixedTitle} class:selected>
  <Splide {options} bind:this={splide} on:move={e => currentPageIndex = e.detail.index} hasTrack={false}>
    {#if fixedTitle}
      <div class="fixed-title">
        <CardHeading text={fixedTitle} />
      </div>
    {/if}
    <SplideTrack>
      {#each cards as card, i}
        <SplideSlide>
          <div class="slide" class:no-heading={card.type==='no-heading'}>
            {#if card.type !== 'no-heading'}
            <CardHeading bind:text={card.heading} editable={editable && currentPageIndex === i} />
            {/if}
            <CardBody bind:text={card.body} editable={editable && currentPageIndex === i} />
          </div>
        </SplideSlide>
      {/each}
    </SplideTrack>
    {#if editable}
      <div class="editor-buttons">
        <IconButton icon="add" on:click={onClickAddCard} />
        <IconButton icon="delete" on:click={onClickRemoveCard} />
        <IconButton icon="title" on:click={onClickChangeType} />
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

<style lang="stylus">

  //$cardColors = red, black, blue

  //for $cardColor, i in $cardColors
    //.card[actualID=\"{i}\"]
      //background-color: $cardColor

  .cards {
    --content-padding: 30px;
    --content-top-padding: 30px;
    --scrollbar-width: 10px;
    border-radius: 20px;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
    color: black;
    background-color: $colors.highlight-1;

    :global(.splide__arrows) {
      position: absolute;
      right: 24px;
      top: 44px;
      display: flex;
      column-gap: 10px;
    }

    :global(.splide__arrow) {
      position: static;
    }

    :global(.splide__arrow:disabled) {
      display: none;
    }

    &.content {
      background-color: $colors.primary-blue;
      color: $colors.neutral-bg;
      border-radius: 20px 20px 0px 0px;

      :global(.splide__arrow) {
        background: $colors.ocean;
      }

      :global(.carousel-dots) {
        --dot-color: $colors.neutral-bg;
      }
    }

    &.highlight {
      background-color: $colors.highlight-1;

      :global(.splide__arrow) {
        background: $colors.highlight-1;
      }

      :global(.gradient) {
        --gradient-color: $colors.highlight-1;
      }
    }

    &.cs-first {
      background-color: $colors.neutral-bg;

      :global(.splide__arrow) {
        background: $colors.neutral-bg;
      }

      :global(.gradient) {
        --gradient-color: $colors.neutral-bg;
      }
    }

    &.cs-second {
      background-color: $colors.neutral-light;

      :global(.splide__arrow) {
        background: $colors.neutral-light;
      }

      :global(.gradient) {
        --gradient-color: $colors.neutral-light;
      }

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
    top: 0;
    padding: var(--content-top-padding) var(--content-padding) 10px;
    margin-bottom: 15px;

    &.no-heading {
      padding-right: 140px;
    }

    .has-fixed-title & :global(.heading) {
      visibility: hidden;
    }
    :global(.heading) {
      max-width: 60%;
    }

    .content & {
      :global(.content) {
        typography: content-card-body;
      }
    }
  }

  .fixed-title {
    :global(.heading) {
      margin-left: 32px;
      margin-top: 25px;
      position: absolute;
    }
  }

  @media(max-width: 425px) {

    .slide {
      padding: 1rem;
    }

    .cards {
      :global(.splide__arrows) {
        top: 35px;
        right: 15px;
      }

      :global(.splide__arrow) {
        width: 48px;
        height: 48px;
      }

      :global(.carousel-dots) {
        --dot-size: 7px;
      }
    }

    .fixed-title {
      :global(.heading) {
        margin-left: 17px;
      }
    }
  }

</style>
