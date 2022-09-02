<script lang="ts">
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import type { CardData, DiagramData, DiagramImage, DiagramLayer, DiagramResource } from '@mpa/db';
  import { Cards } from '$lib/components/shared';
  import { SortableList, EditableText, IconButton } from '$lib/components/generic';
  import { staticUrl } from '$lib/helpers/content';
  import DiagramLayerImgEditor from '$lib/components/cms/DiagramLayerImgEditor.svelte';
  import DownloadableFile from '$lib/components/cms/editor/DownloadableFile.svelte';
  import NewDiagramResourceButton from '$lib/components/cms/NewDiagramResourceButton.svelte';

  export let diagram: DiagramData;
  export let editable = false;
  export let controls: SvelteNodeViewControls = null;

  let currentPageIndex = 0;
  let cards: CardData[] = [];
  let input: HTMLInputElement;
  let width: number;
  let newLayer = false;
  let editLayer: number;

  const BASE_LAYER = -1;

  async function onClickDeleteLayer(index: number) {
    diagram.layers.splice(index, 1);
    diagram.layers = diagram.layers;
  }

  async function updateLayer(diagramImage: DiagramImage, urls: { mobile: string; desktop: string }) {
    diagramImage.mobile = urls.mobile;
    diagramImage.desktop = urls.desktop;
    diagram.layers = diagram.layers;
    editLayer = null;
  }

  async function addResource(resource: DiagramResource) {
    diagram.resources = [...diagram.resources, resource];
  }

  async function addLayer(urls: { mobile: string; desktop: string }) {
    const _newLayer: DiagramLayer = { card: { heading: `Layer ${diagram.layers.length + 1}`, body: '' }, image: urls };
    diagram.layers = [...diagram.layers, _newLayer];
    newLayer = null;
  }

  $: cards = diagram.layers.map(item => item.card);
  $: desktop = width > 768;
</script>

<svelte:window bind:outerWidth={width} />

<div class="diagram">
  <div>
    <div class="layer-imgs">
      {#each diagram.layers as layer, i}
        <img
          class="layer-img"
          class:layer-selected={i === currentPageIndex}
          src={desktop ? staticUrl(layer.image.desktop) : staticUrl(layer.image.mobile)}
          alt="layer-{i}"
        />
      {/each}
      <img
        src={desktop ? staticUrl(diagram.baselayer.desktop) : staticUrl(diagram.baselayer.mobile)}
        alt="diagram"
        on:click={() => input.click()}
      />
    </div>

    <div class="cards">
      <Cards bind:cards {editable} bind:currentPageIndex />
    </div>
  </div>

  <div>
    <div class="caption">
      <strong><EditableText bind:value={diagram.caption.title} {editable} placeholder="Title" /></strong>
      <EditableText bind:value={diagram.caption.body} {editable} placeholder="Description" />
    </div>

    {#if editable || diagram.resources}
      <h4>Download this resource</h4>

      <ul class="resources">
        {#each diagram.resources as resource (resource)}
          <li>
            <DownloadableFile
              bind:resource
              {editable}
              filename={diagram.caption.title}
              on:delete={() => (diagram.resources = diagram.resources.filter(r => r !== resource))}
            />
          </li>
        {/each}
        {#if editable}
          <li class="add-resource">
            <NewDiagramResourceButton on:save={e => addResource(e.detail)} />
          </li>
        {/if}
      </ul>
    {/if}

    {#if editable}
      <div class="layer-list">
        <h4>Layers</h4>

        <IconButton icon="add" on:click={() => (newLayer = true)} text="Add layer" />

        {#if newLayer}
          <DiagramLayerImgEditor on:save={e => addLayer(e.detail)} />
        {/if}
        <div class="layer-list-header">
          Base layer
          <div class="icons">
            <IconButton
              icon="edit"
              on:click={() => (editLayer === null ? (editLayer = BASE_LAYER) : (editLayer = null))}
            />
            <IconButton icon="delete" disabled />
          </div>
        </div>

        {#if editLayer === BASE_LAYER}
          <DiagramLayerImgEditor on:save={e => updateLayer(diagram.baselayer, e.detail)} image={diagram.baselayer} />
        {/if}

        <SortableList list={diagram.layers} on:sort={e => (diagram.layers = e.detail)} let:item let:index>
          <div class="layer-list-header">
            {item.card.heading}
            <div class="icons">
              <IconButton
                icon="edit"
                on:click={() => (editLayer === null ? (editLayer = index) : (editLayer = null))}
              />
              <IconButton icon="delete" on:click={() => onClickDeleteLayer(index)} />
            </div>
          </div>

          {#if editLayer === index}
            <DiagramLayerImgEditor
              on:save={e => updateLayer(diagram.layers[index].image, e.detail)}
              image={diagram.layers[index].image}
            />
          {/if}
        </SortableList>
      </div>
      <div class="controls-diagram">
        <IconButton icon="delete" text="Delete diagram" on:click={controls.delete} />
        <IconButton
          icon={desktop ? 'toggle_off' : 'toggle_on'}
          text="Change view"
          on:click={() => (desktop = !desktop)}
        />
      </div>
    {/if}
  </div>
</div>

<style lang="stylus">

  .diagram {
    flex: 1;
    display: grid;
    grid-template-columns: auto 166px;
    column-gap: 20px;
    --ib-hover-bg: $colors.secondary-bg;

    typography: ui-small;
  }

  .layer-imgs {
    margin-bottom: 20px;
    img {
      max-width: 800px;
    }

    &::after {
      content: ' ';
      display: table;
      clear: both;
    }
  }

  .layer-img {
      float: left;
      margin-right: -100%;
      position: relative;
      z-index: 1;

      &:not(.layer-selected) {
        display: none;
      }
    }

  .cards {
    :global(.editor-buttons) {
      display: none;
    }
    margin-bottom: 22px;
  }

  :global(.icon-button::before) {
    background-color: transparent !important;
  }

  .layer-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .icons {
    float: right;
    display: flex;
  }

  .caption {
    margin-bottom: 22px;

    :global(.editable-text) {
      --outline-color: #d1d1d1;
      --caret-color: $colors.neutral-black;
    }
  }

  .resources {
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 0;
    column-gap: 2rem;
    padding: 0 1rem;
    flex-wrap: wrap;
  }

  .controls-diagram {
    margin-top: 3rem ;
  }

  @media (max-width: 1024px) {
    .diagram {
      grid-template-columns: auto;
    }
    img {
      object-fit: cover;
      width: 100%;
      max-height: 100%;
    }
  }
</style>
