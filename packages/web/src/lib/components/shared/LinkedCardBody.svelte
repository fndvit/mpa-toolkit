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
  let showURL = false;
  let urlElement;

  const dispatch = createEventDispatcher<{ deleteCard: LinkCardData }>();

  const deleteCard = () => {
    dispatch('deleteCard', card);
  };

  const onClickRemoveCard = () => {
    deleteCard();
  };

  const getMetaData = async () => {
    try {
      if (card?.url.trim().length === 0) return;
      loading = true;
      const response = await fetch(`/api/util/meta-scraper?url=${card.url}`);
      const { res } = await response.json();
      if (res?.title) card.title = res.title;
      if (res?.image) {
        const imgResponse = await fetch(res.image, { method: 'GET', headers: { accept: 'application/json' } });
        const blob = await imgResponse.blob();
        const file = new File([blob], 'metaImage', { type: blob.type });
        const path = await api.image.upload(file);
        card.img = path;
      } else card.img = '';
    } catch (e) {
      card.img = '';
      console.error(e);
    }
    showURL = false;
    loading = false;
  };
</script>

<svelte:element this={editable ? 'div' : 'a'} class="content" href={card?.url} target="_blank" class:on-view={!editable}>
  <div class="card-space">
    <div class="left-section">
      {#if loading}
        <Spinner />
      {/if}
      <EditableText bind:value={card.title} {editable} placeholder={'Title'} />
    </div>
    <div class="right-section">
      <div class="image">
        {#if loading}
          <Spinner />
        {:else if card?.img}
          <img class:opacity={!card?.img} src={staticUrl(card?.img)} alt={card.title} />
        {/if}
      </div>
      {#if editable}
        <div class="controls">
          <IconButton icon="delete" on:click={onClickRemoveCard} />
          <IconButton
            icon={showURL ? 'visibility_off' : 'add_link'}
            on:click={() => (showURL ? (showURL = false) : (showURL = true))}
          />
        </div>
      {/if}
    </div>
  </div>
  {#if showURL}
    <div class="link-space">
      <b>URL: </b>
      <input
        bind:this={urlElement}
        bind:value={card.url}
        placeholder="URL"
        on:blur={() => getMetaData()}
        on:keypress={({ key }) => {
          if (key === 'Enter') {
            urlElement.blur();
            getMetaData();
          }
        }}
      />
    </div>
  {/if}
</svelte:element>

<style lang="stylus">
  .content {
    padding: 1rem 0 0.5rem 0;
    border-radius: 20px;
    typography: p-graphic;
    text-decoration: none;
    color: inherit;
  }

  .card-space{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .image{
    img{
      width: 83px;
      height: 83px;
      object-fit: cover;
      border-radius: 5px;
    }
  }
  .left-section{
    :global(.editable-text) {
      overflow: hidden;
      word-break: break-word;
      caret-color: var(--color-primary);
    }
  }
  .right-section{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .controls{
    display: flex;
    flex-direction: column;
    align-items: center;
    column-gap: 10px;
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
</style>
