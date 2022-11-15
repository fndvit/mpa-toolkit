<script lang="ts">
  import type { LinkCardData } from '@mpa/db';
  import { createEventDispatcher } from 'svelte';
  import Spinner from '../generic/Spinner.svelte';
  import { EditableText, IconButton } from '$lib/components/generic';
  import defaultImage from '$lib/assets/image-default.png';

  export let card: LinkCardData;
  export let editable = false;

  let image = defaultImage;
  let loading = false;

  const dispatch = createEventDispatcher<{ deleteCard: LinkCardData }>();

  const deleteCard = () => {
    dispatch('deleteCard', card);
  };

  const onClickRemoveCard = () => {
    deleteCard();
  };

  const getMetaImage = async url => {
    loading = true;
    try {
      const response = await fetch(`/api/util/meta-scraper?url=${url}`);
      const { res } = await response.json();
      console.log(res);
      if(res?.image) image = res.image;
    }
    catch (e) {
      console.error(e);
    }
    loading = false;
  };

  $: if (card?.url && !editable) getMetaImage(card.url);

</script>

{#if editable}
  <div class="content" >
    <div class="card-space">
      <div class="content-input-text">
        <b>Title: </b>
        <EditableText bind:value={card.heading} {editable} placeholder="Heading" />
      </div>
      <div class="content-input-text">
        <b>URL: </b>
        <EditableText bind:value={card.url} {editable} placeholder="URL" />
      </div>
    </div>
    <IconButton icon="delete" on:click={onClickRemoveCard} />
  </div>
{:else}
  <a class="content on-view" href="{card?.url}" target="_blank">
    <div class="card-space">
      <div class="content-input-text">
        <p>{card.heading}</p>
      </div>
    </div>
    {#if loading}
    <Spinner />
    {:else}
    <img class="card-img" src={image} alt={card.heading}/>
    {/if}

  </a>
{/if}

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
      font-weight: bold;
      img {
        transform: scale(1.1);
        transition: all 0.5s ease;
      }


    }
  }

  .content-input-text {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    width: inherit;
    :global(.editable-text) {
      overflow: hidden;
      word-break: break-word;
      caret-color: var(--color-primary);
    }
  }

  .card-img {
    width: 83px;
    height: 83px;
    object-fit: cover;
    border-radius: 5px;
  }
</style>
