<script lang="ts" context="module">
  export type CardStackStyle = 'no-heading' | 'default';
</script>

<script lang="ts">
  import type { CardData } from '@mpa/db';
  import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
  import CardHeading from './CardHeading.svelte';
  import CardBody from './CardBody.svelte';
  import { IconButton } from '$lib/components/generic';
  import { CarouselDots } from '$lib/components/shared';
  import { SplideOptions } from '$lib/helpers/splide';

  export let cards: CardData[];
  export let cardStyle: CardStackStyle = 'default';
  export let currentPageIndex = 0;
  export let editable = false;
  export let fixedTitle: string = null;
  export let selected = false;
  export let progress = true;
  export let canToggleHeading = true;
  export let removable = true;

  let splide: Splide;

  let options = SplideOptions({
    rewind: true,
    autoHeight: true,
    gap: -3,
    pagination: false
  });

  const onClickAddCard = () => {
    cards.push({ heading: '', body: '' });
    cards = cards;
    window.setTimeout(() => splide.go(cards.length - 1));
  };

  const onClickRemoveCard = () => {
    cards = cards.filter((_, i) => i !== currentPageIndex);
    const goTo = Math.max(0, Math.min(currentPageIndex, cards.length - 1));
    splide.go(goTo);
  };

  const onClickChangeType = () => {
    cardStyle = cardStyle === 'default' ? 'no-heading' : 'default';
  };

  $: if (currentPageIndex >= 0 && splide) splide.go(currentPageIndex);
</script>

<div
  class="cards"
  class:has-fixed-title={fixedTitle}
  class:multiple-slides={cards.length > 1}
  data-card-style={cardStyle}
  class:selected
>
  <Splide {options} bind:this={splide} on:move={e => (currentPageIndex = e.detail.index)} hasTrack={false}>
    {#if fixedTitle}
      <div class="fixed-title">
        <CardHeading text={fixedTitle} />
      </div>
    {/if}
    <SplideTrack>
      {#each cards as card, i}
        <SplideSlide>
          <div class="slide" class:no-heading={cardStyle === 'no-heading'}>
            {#if cardStyle !== 'no-heading'}
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
        <IconButton icon="delete" on:click={onClickRemoveCard} disabled={!removable && cards.length === 1} />
        {#if canToggleHeading}
          <IconButton icon="title" active={cardStyle === 'default'} on:click={onClickChangeType} />
        {/if}
      </div>
    {/if}
    {#if editable || cards.length > 1}
      <div class="carousel-dots card-bottom">
        <CarouselDots bind:currentPageIndex pagesCount={cards.length} progress={!editable && progress} />
      </div>
    {/if}
  </Splide>
</div>

<style lang="postcss">
  @define-mixin card-styles $cardColor, $textColor, $arrowButtonColor: $cardColor {
    --card-color: $cardColor;
    --editable-caret: $textColor;
    --editable-hover-bg: #fff2;
    --dot-color: $textColor;
    --arrow-button-color: $arrowButtonColor;

    color: $textColor;
  }

  .cards {
    --content-padding: 30px;
    --content-right-padding: 30px;
    --content-top-padding: 30px;
    --scrollbar-width: 5px;

    border-radius: 20px;
    box-shadow: 0 3px 16px rgb(0 0 0 / 15%);
    color: black;
    background-color: var(--card-color);

    :global(.splide__arrows) {
      position: absolute;
      right: 24px;
      top: 44px;
      display: flex;
      column-gap: 10px;
    }

    :global(.splide__arrow) {
      position: static;
      background-color: var(--arrow-button-color);

      &:hover {
        filter: grayscale(10%) brightness(105%);
      }
    }

    :global(.splide__arrow:disabled) {
      display: none;
    }

    :global(.gradient) {
      --gradient-color: var(--card-color);
    }

    :global(.key-takeaways) &,
    :global(.landing-lifecycle) & {
      @mixin card-styles $c-highlight-1, black;
    }

    :global(.body-column) &,
    :global(.editor-content) & {
      @mixin card-styles $c-primary-blue, white, color($c-primary-blue lightness(+10%) saturation(-25%));
    }

    :global(.key-learnings .card-content) & {
      @mixin card-styles $c-neutral-bg, black;

      box-shadow: none;
    }

    :global(.diagram) & {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  .editor-buttons {
    position: absolute;
    right: 40px;
    display: flex;
    column-gap: 5px;
    justify-content: right;

    :global(.icon-button) {
      --ib-icon-bg: #0002;
      --ib-hover-bg: #0002;
      --ib-hover-border-color: #0002;
      --ib-active-bg: #fff7;
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
    padding: var(--content-top-padding) var(--content-right-padding) 10px var(--content-padding);
    margin-bottom: 15px;

    .cards.multiple-slides[data-card-style='no-heading'] & {
      --content-right-padding: 140px;
    }

    .has-fixed-title & :global(.heading) {
      visibility: hidden;
    }

    :global(.heading) {
      max-width: 60%;
    }
  }

  .fixed-title {
    :global(.heading) {
      margin-left: 32px;
      margin-top: 25px;
      position: absolute;
    }
  }

  @media (max-width: 425px) {
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
  }
</style>
