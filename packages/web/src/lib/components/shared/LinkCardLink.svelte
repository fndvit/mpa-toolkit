<script lang="ts">
  import type { LinkCardData } from '@mpa/db';
  import { createEventDispatcher } from 'svelte';
  import Spinner from '../generic/Spinner.svelte';
  import { EditableText, IconButton, toaster } from '$lib/components/generic';
  import * as api from '$lib/api';
  import imagePlaceholder from '$lib/assets/image-placeholder.svg';
  import ImageEditButton from '../cms/editor/toolbar/ImageEditButton.svelte';
  import { HTTPError } from 'ky';
  import Picture from '../generic/Picture.svelte';

  export let card: LinkCardData = {} as LinkCardData;
  export let editable = false;

  let loadingText = false;
  let loadingImage = !!card.url;
  let uploadingImage = false;
  let editingURL = false;
  let editUrl = card.url;

  const dispatch = createEventDispatcher<{ delete: LinkCardData }>();

  const getMetaData = async () => {
    if ((card.title && card.img) || card?.url.trim().length === 0) return;
    try {
      loadingText = !card.title;
      uploadingImage = !card.img;
      const { title, image } = await api.link.create(card.url);
      if (title && !card.title) card.title = title;
      if (image && !card.img) card.img = image;
    } catch (e) {
      console.error(e);
      const msg = e instanceof HTTPError && (await e.response.json()).message;
      toaster.error('Error fetching URL' + (msg ? `: ${msg}` : ''));
    }
    loadingText = false;
    uploadingImage = false;
  };

  const isURLValid = (url: string) => {
    try {
      return ['http:', 'https:'].includes(new URL(url).protocol);
    } catch (e) {
      return false;
    }
  };

  $: validURL = isURLValid(editUrl);
  $: editingURL = editingURL || (editable && !card.url);
</script>

<svelte:element
  this={editable ? 'div' : 'a'}
  class="linkcard-link"
  href={card?.url}
  target="_blank"
  class:linkcard-link--edit-url={editingURL}
>
  <div class="linkcard-text">
    {#if loadingText}
      <Spinner />
    {:else if editingURL}
      <form
        class="linkcard-url"
        on:submit={e => {
          card.url = editUrl;
          editingURL = false;
          getMetaData();
          e.preventDefault();
        }}
      >
        <div class="linkcard-url-input-wrapper">
          <input bind:value={editUrl} placeholder="Enter URL…" on:focus={() => (editingURL = true)} />
        </div>
        <IconButton
          icon={'done'}
          disabled={!validURL || editUrl === card.url}
          title={!validURL && 'Invalid URL'}
          square
          type="submit"
        />
        <IconButton
          href={validURL ? editUrl : undefined}
          disabled={!validURL}
          rel="external"
          target="_blank"
          icon="open_in_new"
          square
          on:click={() => window.open(editUrl, '_blank')}
        />
      </form>
    {:else}
      <EditableText bind:value={card.title} {editable} placeholder={'Title'} />
    {/if}
  </div>
  <div class="linkcard-image">
    {#if uploadingImage || loadingImage}
      <Spinner />
    {/if}
    {#if editable}
      <ImageEditButton
        title="Edit image"
        on:uploaded={e => {
          card.img = e.detail;
          uploadingImage = false;
        }}
        on:uploading={() => {
          card.img = null;
          uploadingImage = true;
        }}
      />
    {/if}
    <Picture
      src={card?.img}
      fallback={imagePlaceholder}
      alt={card.title}
      config={{ width: [100, 170] }}
      bind:loading={loadingImage}
    />
  </div>
  {#if editable}
    <div class="linkcard-controls">
      <IconButton icon="delete" on:click={() => dispatch('delete', card)} square />
      <div class="linkcard-controls--url">
        <IconButton
          icon="link"
          on:click={() => {
            editUrl = card.url;
            editingURL = true;
          }}
          square
        />
        <IconButton
          icon="close"
          on:click={() => {
            editUrl = card.url;
            editingURL = false;
          }}
          square
          disabled={!card.url}
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

  .linkcard-link:not(.linkcard-link--edit-url, :hover) .linkcard-controls {
    visibility: hidden;
  }

  :global(.page-editor--editing .linkcards) {
    :global(.editable-content):hover {
      cursor: text;
    }

    .linkcard-text {
      flex: 1;
    }
  }

  .linkcard-controls--url {
    display: flex;
    flex-direction: row;

    .linkcard-link--edit-url & :global([data-id='link']) {
      display: none;
    }

    .linkcard-link:not(.linkcard-link--edit-url) & {
      :global([data-id='done']),
      :global([data-id='close']) {
        display: none;
      }
    }
  }

  .linkcard-url {
    align-items: center;
    height: 24px;
    background: $c-neutral-bg;
    display: flex;

    > * {
      flex: 1;
    }

    input {
      font-size: 12px;
      height: 22px;
      border: none;
      box-shadow: 0 0 0 1px #0007;
      outline: none;
      width: 100%;
      padding-right: 1.6rem;
      box-sizing: border-box;

      &:focus {
        outline: 1px solid #0001;
      }
    }

    .linkcard-url-input-wrapper {
      position: relative;
    }

    .linkcard-url-input-wrapper::after {
      content: 'link';
      font-family: 'Material Icons';
      display: block;
      position: absolute;
      top: 1px;
      right: 5px;
      bottom: 0;
      color: #bbb;
      pointer-events: none;
    }

    :global(.icon-button-container) {
      z-index: 10;
      position: relative;

      :global([data-icon='link']):disabled {
        opacity: initial;
      }
    }
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
    overflow: hidden;

    :global(img) {
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

    :global(.icon-button-container) {
      --ib-color: black;

      background: #fff9;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;

      > :global(.icon-button) {
        height: 100%;
        width: 100%;
        border-radius: 0;
      }

      .linkcard-image:not(:hover)& {
        display: none;
      }

      z-index: 10;
    }
  }

  .linkcard-controls {
    --ib-size: 32px;

    box-shadow: 0 0 5px 1px #0002;
    border-radius: 5px;
    position: absolute;
    background: $c-neutral-bg;
    padding: 3px;
    right: calc(-2rem - 1.37rem);
    transform: translateX(15px);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    align-self: flex-start;
  }

  @media (max-width: 768px) {
    .linkcard-link {
      @mixin font-responsive p-graphic;
    }
  }
</style>
