<script lang="ts">
  import type { LinkCardData } from '@mpa/db';
  import CardHeading from './CardHeading.svelte';
  import { IconButton } from '$lib/components/generic';
  import LinkedCardBody from './LinkedCardBody.svelte';

  export let cards: LinkCardData[];
  export let title: string = '';
  export let editable = false;

  const MAX_CARDS = 5;

  const onClickAddCard = () => {
    cards.push({} as LinkCardData);
    cards = cards
  };

  const onClickDeleteCard = (index: number) => {
    cards.splice(index, 1);
    cards = cards
  };
</script>

<div class="cards">
    <div class="fixed-title">
      <CardHeading bind:text={title} editable/>
    </div>

    <ul class="cards-list">
      {#each cards as card, i}
        <li class="card">
          <LinkedCardBody bind:card={card} {editable} on:deleteCard={() => onClickDeleteCard(i)}/>
        </li>
      {/each}
    </ul>
    {#if editable}
      <div class="editor-buttons">
        <div class="cont">
          {cards.length} / {MAX_CARDS}
        </div>
        <IconButton icon="add" on:click={onClickAddCard} disabled={cards.length >= MAX_CARDS} />
      </div>
    {/if}
</div>

<style lang="stylus">

  card-styles($cardColor)
    $textColor = dark($cardColor) ? white : black;
    --card-color: $cardColor;
    --caret-color: $textColor;
    --dot-color: $textColor;
    color: $textColor;
  .cards {
    padding: 1rem 0.5rem;
    background-color: $colors.neutral-light;
    border-radius: 20px;
  }
  .card {
    height: 100%;

    margin-right: 1rem;
    .image {
      height: 156px;
      background-color: green;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
     li {
      border-bottom: 1px solid white;
     }
     li:last-child {
      border-bottom: none;
    }
  }
  .editor-buttons {
    display: flex;
    justify-content: right;
    margin-right: 1rem;
    padding: 10px;
    align-items: center;
    column-gap: 1rem;

    :global(.icon-button) {
      --ib-icon-bg: #00000022;
      --ib-hover-bg: #00000022;
      --ib-hover-border-color: #00000022;
      --ib-active-bg: #ffffff77;
    }
  }

  .fixed-title {
    :global(.heading) {
      padding: 0.5rem 1rem;
      typography: h5;
    }
  }

</style>
