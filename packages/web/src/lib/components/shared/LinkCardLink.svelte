<script lang="ts">
  import type { LinkCardData } from '@mpa/db';
  import { createEventDispatcher, tick } from 'svelte';
  import Spinner from '../generic/Spinner.svelte';
  import { EditableText, IconButton } from '$lib/components/generic';
  import * as api from '$lib/api';
  import { staticUrl } from '$lib/helpers/content';
  import imagePlaceholder from '$lib/assets/image-placeholder.svg';

  export let card: LinkCardData = {} as LinkCardData;
  export let editable = false;

  let loading = false;
  let editingURL = false;
  let editUrl = card.url;
  let urlElement;

  const dispatch = createEventDispatcher<{ delete: LinkCardData }>();
  const deleteCard = () => dispatch('delete', card);

  const getMetaData = async () => {
    try {
      if (card?.url.trim().length === 0) return;

      loading = true;

      const { title, image } = await api.link.create(card.url);

      if (title) card.title = title;
      if (image) {
        card.img = image;
      } else card.img = '';
    } catch (e) {
      card.img = '';
      console.error(e);
    }
    editingURL = false;
    loading = false;
  };

  const onClickCancelUrlEdit = async (e: Event) => {
    editUrl = card.url;
    editingURL = false;
  };

  const onSubmitURL = () => {
    card.url = editUrl;
    editingURL = false;
    getMetaData();
  };
  $: editingURL = card.url !== editUrl;
  const isURLValid = (url: string) => {
    try {
      return ['http:', 'https:'].includes(new URL(url).protocol);
    } catch (e) {
      return false;
    }
  };
  $: validURL = isURLValid(editUrl);
</script>

<svelte:element
  this={editable ? 'div' : 'a'}
  class="linkcard-link"
  href={card?.url}
  target="_blank"
  class:linkcard-link--show-url={editingURL}
>
  <div class="linkcard-text">
    {#if loading}
      <Spinner />
    {:else}
      <EditableText bind:value={card.title} {editable} placeholder={'Title'} />
    {/if}
  </div>
  <div class="linkcard-image" class:linkcard-image--empty={loading || !card?.img}>
    {#if loading}
      <Spinner />
    {/if}
    <img src={!loading && card?.img ? staticUrl(card.img) : imagePlaceholder} alt={card.title} />
  </div>
  {#if editable}
    <div class="linkcard-controls">
      <IconButton icon="delete" on:click={deleteCard} square />
      <div class="linkcard-url">
        <form on:submit|preventDefault|stopPropagation={onSubmitURL}>
          <input
            bind:this={urlElement}
            bind:value={editUrl}
            placeholder="Enter URL…"
            on:focus={() => (editingURL = true)}
            on:blur={() => (editingURL = editUrl !== card.url)}
          />
          <IconButton href={card.url} rel="external" target="_blank" icon="open_in_new" square />
          <IconButton icon={'done'} disabled={!editingURL || !validURL} title={!validURL && 'Invalid URL'} square />
        </form>
        <IconButton
          icon={editingURL ? 'close' : 'link'}
          disabled={!editingURL}
          on:click={onClickCancelUrlEdit}
          square
        />
      </div>
    </div>
  {/if}
</svelte:element>

<style lang="postcss">
  .linkcard-link {
    position: relative;
    padding: 0.625rem 0;
    border-radius: 20px;
    font: $f-p-graphic;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    column-gap: 1.5rem;

    :global(.editable-text) {
      margin-bottom: 20px;
    }

    :global(.page-editor--editing) &::before {
      /* to make hoverstate continuous for the controls */
      content: '';
      position: absolute;
      left: 100%;
      top: 0;
      height: 100%;
      width: 75px;
    }
  }

  :global(a).linkcard-link:hover {
    text-decoration: underline;
  }

  :global(.page-editor--editing .linkcards) {
    &:not(:hover) .linkcard-link:not(.linkcard-link--show-url) .linkcard-controls {
      visibility: hidden;
    }

    :global(.editable-content):hover {
      cursor: text;
    }

    .linkcard-text {
      flex: 1;
    }
  }

  .linkcard-url {
    form {
      position: absolute;
      background: $c-neutral-bg;
      right: 2rem;
      display: flex;
      width: 0;
      overflow: hidden;
      transition: all 100ms ease-in-out;
      filter: drop-shadow(0 0 0.25rem rgb(0 0 0 / 20%));

      > * {
        flex: 1;
      }

      input {
        font-size: 12px;
      }
    }

    :global(.icon-button-container) {
      z-index: 10;
      position: relative;

      :global([data-icon='link']):disabled {
        opacity: initial;
      }
    }
  }

  .linkcard-link--show-url .linkcard-url form,
  .linkcard-link:hover .linkcard-url form {
    width: 400px;
  }

  .linkcard-text {
    :global(.editable-text) {
      overflow: hidden;
      word-break: break-word;
      caret-color: var(--color-primary);
    }
  }

  .linkcard-image {
    position: relative;
    align-self: flex-start;
    width: 83px;
    height: 83px;
    flex: 0 0 auto;

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    :global(.spinner) {
      position: absolute;
      display: flex;
      width: 100%;
      height: 100%;
      background: #fff9;
    }

    &.linkcard-image--empty img {
      background: #d0d0d0;
      object-fit: contain;
    }
  }

  .linkcard-controls {
    position: absolute;
    background: $c-neutral-bg;
    right: calc(-2rem - 1.37rem);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    align-self: flex-start;

    :global(.icon-button-container) {
      background: $c-neutral-bg;
    }
  }

  @media (max-width: 768px) {
    .linkcard-link {
      @mixin font-responsive p-graphic;
    }
  }
</style>
