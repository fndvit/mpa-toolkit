<script lang="ts">
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import type { CardData, DiagramData, DiagramLayer, DiagramResource } from '@mpa/db';
  import { Cards } from '$lib/components/shared';
  import { SortableList, EditableText, IconButton } from '$lib/components/generic';
  import { staticUrl } from '$lib/helpers/content';
  import DownloadableFile from '$lib/components/cms/editor/DownloadableFile.svelte';
  import NewDiagramResourceButton from '$lib/components/cms/NewDiagramResourceButton.svelte';
  import DiagramLayerListItem from '$lib/components/cms/DiagramLayerListItem.svelte';

  export let diagram: DiagramData;
  export let editable = false;
  export let controls: SvelteNodeViewControls = null;

  const BASE_LAYER = -1;
  let currentPageIndex = 0;
  let cards: CardData[] = [];
  let width: number;
  let editLayer: DiagramLayer | typeof BASE_LAYER;

  function onClickLayerItem(layer: typeof editLayer) {
    editLayer = editLayer === layer ? null : layer;
    if (layer !== -1) currentPageIndex = diagram.layers.indexOf(layer);
  }

  function addResource(resource: DiagramResource) {
    diagram.resources = [...diagram.resources, resource];
  }

  function addNewLayer() {
    const newLayer: DiagramLayer = {
      card: { heading: `Layer ${diagram.layers.length + 1}`, body: '' },
      image: { mobile: null, desktop: null }
    };
    diagram.layers = [...diagram.layers, newLayer];
  }

  $: cards = diagram.layers.map(item => item.card);
  $: desktop = width > 768;
</script>

<svelte:window bind:outerWidth={width} />
<svelte:body on:click={() => (editLayer = null)} />

<div class="diagram">
  <div>
    <div class="layer-imgs">
      <img class="base-layer" src={staticUrl(diagram.baselayer[desktop ? 'desktop' : 'mobile'])} alt="diagram" />
      {#each diagram.layers as layer, i}
        <img
          class="layer-img"
          class:layer-selected={i === currentPageIndex}
          src={desktop ? staticUrl(layer.image.desktop) : staticUrl(layer.image.mobile)}
          alt="layer-{i}"
        />
      {/each}
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

        <DiagramLayerListItem
          title="Base layer"
          image={diagram.baselayer}
          edit={editLayer === BASE_LAYER}
          highlight={editLayer === BASE_LAYER}
          deletable={false}
          on:click={() => onClickLayerItem(BASE_LAYER)}
          on:update={() => (diagram.layers = diagram.layers)}
        />

        <SortableList list={diagram.layers} on:sort={e => (diagram.layers = e.detail)} let:item let:index>
          <DiagramLayerListItem
            title={item.card.heading}
            image={item.image}
            edit={item === editLayer}
            highlight={index === currentPageIndex}
            on:click={() => onClickLayerItem(item)}
            on:delete={() => (diagram.layers = diagram.layers.filter(l => l !== item))}
            on:update={() => (diagram.layers = diagram.layers)}
            on:dragstart={() => {
              console.log('dragstart');
              // editLayer = null;
            }}
          />
        </SortableList>

        <IconButton icon="add" on:click={addNewLayer} text="Add layer" />
      </div>

      <div class="controls-diagram">
        <IconButton icon="delete" text="Delete diagram" on:click={controls.delete} />
        <IconButton
          icon={desktop ? 'toggle_off' : 'toggle_on'}
          text={desktop ? 'Switch to mobile view' : 'Switch to desktop view'}
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
    position: relative;
    z-index: 1;
    margin-bottom: 20px;
    width: 800px;
    font-size: 0;
    overflow: hidden;
  }

  .base-layer {
    width: 100%;

  }

  .layer-img {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;

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

  .layer-list {
    position: relative;
    z-index: 2;
    :global(ul) {
      margin: 0.5rem 0;
    }
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
    margin-top: 1rem ;
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
