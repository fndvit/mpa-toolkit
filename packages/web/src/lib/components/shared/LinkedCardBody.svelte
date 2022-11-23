<script lang="ts">
  import type { LinkCardData } from '@mpa/db';
  import { createEventDispatcher } from 'svelte';
  import Spinner from '../generic/Spinner.svelte';
  import { EditableText, IconButton } from '$lib/components/generic';
  import * as api from '$lib/api';
  import { staticUrl } from '$lib/helpers/content';

  export let card: LinkCardData = {} as LinkCardData;
  export let editable = false;

  let loading = false;
  let urlSetted = false;
  let urlElement;

  const dispatch = createEventDispatcher<{ deleteCard: LinkCardData }>();

  const deleteCard = () => {
    dispatch('deleteCard', card);
  };

  const onClickRemoveCard = () => {
    deleteCard();
  };

  const getMetaData = async () => {
    urlSetted = true;
    loading = true;
    try {
      const response = await fetch(`/api/util/meta-scraper?url=${card.url}`);
      const { res } = await response.json();
      if(res?.title) card.title = res.title;
      if(res?.image)
      {
        const imgResponse = await fetch(res.image, { method: "GET", headers: { accept: 'application/json'}});
        const blob = await imgResponse.blob();
        const file = new File([blob], 'metaImage', {type: blob.type});
        const path = await api.image.upload(file);
        card.img = path;
      }
    }
    catch (e) {
      console.error(e);
    }
    loading = false;
  };

</script>

{#if editable}
  <div class="content" >
    <div class="card-space">
      <div class="content-input-text">
        <b>URL: </b>
        <EditableText
          bind:this={urlElement}
          bind:value={card.url}
          {editable}
          placeholder="URL"
          on:blur={() => getMetaData()}
          on:keypress={({ key }) => {if(key === 'Enter'){ urlElement.blur(); getMetaData();}}}
        />
      </div>
      {#if urlSetted}
      <div class="content-input-text">
        <b>Title: </b>
        <EditableText
          bind:value={card.title}
          {editable}
          placeholder={loading ? "Getting metadata title..." : "Heading"}
          />
      </div>
      {/if}
    </div>
    <IconButton icon="delete" on:click={onClickRemoveCard} />
  </div>
{:else}
  <a class="content on-view" href="{card?.url}" target="_blank">
    <div class="card-space">
      <div class="content-input-text">
        <p>{card.title}</p>
      </div>
    </div>
    {#if loading}
    <Spinner />
    {:else}
    <img class="card-img" class:opacity={!card?.img} src={staticUrl(card?.img)} alt={card.title}/>
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

    p{
      word-break: break-word;
    }
  }

  .card-img {
    width: 83px;
    height: 83px;
    object-fit: scale-down;
    border-radius: 5px;
  }

  .opacity {
    opacity: 0;
  }
</style>
