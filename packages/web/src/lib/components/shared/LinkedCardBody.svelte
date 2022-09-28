<script lang="ts">
  import { EditableText, IconButton } from '$lib/components/generic';
  import type { LinkCardData } from '@mpa/db';
  import { createEventDispatcher, onMount } from 'svelte';

  export let card: LinkCardData;
  export let editable = false;

  const dispatch = createEventDispatcher<{deleteCard: LinkCardData}>();

  const deleteCard = () => {
    dispatch('deleteCard', card);
  }

  const onClickRemoveCard = () => {
    deleteCard();
  }

  const getRandomImage = async () => {
    const response = await fetch(`https://source.unsplash.com/random/800x600`)
    return response;
  };

  let img = '';
</script>

<div class="content" class:on-view={!editable}>

  <div class="card-space">
    <div class="content-input-text" class:hide-editable={!editable}>
      <b>URL: </b>
      <EditableText bind:value={card.url} {editable} placeholder="URL" />
    </div>
    <div class="content-input-text">
      <b class:hide-editable={!editable}>Title: </b>
      <EditableText bind:value={card.heading} {editable} placeholder="Heading" />
    </div>
  </div>
  {#if editable}
  <IconButton icon="delete" on:click={onClickRemoveCard}/>
  {/if}
  <img class='card-img' src={img} alt={card.heading} class:hide-editable={editable}/>



</div>


<style lang="stylus">

  .content {
    typography: p-graphic;
    display: flex;
    flex-direction: row;
    padding: 1rem 0 0.5rem 1rem;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px;

    //remove a tags default styles
    text-decoration: none;
    color: inherit;
  }

  .on-view{
    cursor: pointer;
    align-items: flex-start;
    &:hover {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    }
  }

  .content-input-text {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    width: 100%;
    :global(.editable-text) {
      overflow: hidden;
    }
  }

  .card-img {
    width: 83px;
    height: 83px;
    object-fit: cover;
    border-radius: 5px;
  }

  .hide-editable {
    display: none;
  }
</style>
