<script lang="ts">
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import type { CardData, DiagramData } from '@mpa/db';
  import { Cards, SortableList, EditableText, IconButton, InlineSvg } from '$lib/components';
  import { staticUrl } from '$lib/helpers/content';
  import * as api from '$lib/api';

  export let diagram: DiagramData;
  export let editable = false;
  export let controls: SvelteNodeViewControls = null;

  let currentPageIndex = 0;
  let cards: CardData[] = [];
  let input: HTMLInputElement, imageMobile: HTMLInputElement, imageDesktop: HTMLInputElement;
  let width = null,
    newResource = null,
    newLayer = null,
    editLayer = null;
  let desktop = false;
  let view = 'toggle_on';

  $: {
    cards.forEach((obj, i) => {
      diagram.layers[i].card = obj;
    });
    if (width > 768) desktop = true;
    else desktop = false;
  }

  let list = diagram.layers.map((layer, index) => ({
    id: index,
    value: layer
  }));

  console.log('LIST: ', list);

  const sortList = ev => {
    list = ev.detail;
    console.log('event: ', ev.detail);
  };

  const updateCardsArray = () => {
    cards = [];
    diagram.layers.forEach(obj => {
      cards.push(obj.card);
    });
    cards = cards;
  };

  const onClickEdit = (index: number) => {
    editLayer = index;
  };
  const onClickAddResource = () => {
    newResource = { label: '', url: '' };
  };
  const onClickAddLayer = () => {
    newLayer = {
      image: { desktop: '', mobile: '' },
      card: { heading: '', body: '' }
    };
  };

  const changeView = () => {
    desktop = !desktop;
    if (view == 'toggle_on') view = 'toggle_off';
    else view = 'toggle_on';
  };

  async function onClickDeleteLayer(index: number) {
    diagram.layers.splice(index, 1);
    diagram.layers = diagram.layers;
    updateCardsArray();
  }

  async function updateLayer(index: number) {
    diagram.layers[index].image.mobile = await api.asset.upload(imageMobile.files[0]);
    diagram.layers[index].image.desktop = await api.asset.upload(imageDesktop.files[0]);

    editLayer = null;
  }

  async function addResource() {
    newResource.url = await api.asset.upload(input.files[0]);

    diagram.resources.push(newResource);
    diagram.resources = diagram.resources;
    newResource = null;
  }

  async function addLayer() {
    newLayer.image.mobile = await api.asset.upload(imageMobile.files[0]);
    newLayer.image.desktop = await api.asset.upload(imageDesktop.files[0]);

    diagram.layers.push(newLayer);
    diagram.layers = diagram.layers;
    newLayer = null;

    updateCardsArray();
  }

  async function onImageChange() {
    if (desktop) diagram.baselayer.desktop = await api.asset.upload(input.files[0]);
    else diagram.baselayer.mobile = await api.asset.upload(input.files[0]);
  }

  if (cards.length == 0) updateCardsArray();
</script>

<svelte:window bind:outerWidth={width} />

<div class="diagram">
  <div>
    <div class="baselayer-img">
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
      <input class="image-input" bind:this={input} type="file" on:change={onImageChange} />
    </div>

    <div class="cards">
      <Cards bind:cards {editable} bind:currentPageIndex />
    </div>
  </div>

  <div class="column-2">
    <div class="caption">
      <strong><EditableText bind:value={diagram.caption.title} {editable} placeholder="Title" /></strong>
      <EditableText bind:value={diagram.caption.body} {editable} placeholder="Description" />
    </div>

    <div class="resources">
      <h4>Download this resource</h4>

      {#if editable}
        <IconButton icon="add" on:click={onClickAddResource} text="Add resource" />
        {#if newResource !== null}
          <form on:submit|preventDefault={addResource} class="form">
            <div>
              <input type="text" bind:value={newResource.label} placeholder="Name" />
              <input type="file" bind:this={input} />
            </div>
            <input type="submit" class="button" value="ADD" />
          </form>
        {/if}
      {/if}

      {#if diagram.resources}
        {#each diagram.resources as resource}
          <div class="resource">
            <InlineSvg svg="file" />
            <strong>{resource.label}</strong>
          </div>
        {/each}
      {/if}
    </div>

    {#if editable}
      <div class="layer-list">
        <h4>Layers</h4>

        <IconButton icon="add" on:click={onClickAddLayer} text="Add layer" />
        {#if newLayer !== null}
          <form on:submit|preventDefault={addLayer} class="form">
            <div>
              <span>Mobile version</span><input type="file" bind:this={imageMobile} />
              <span>Desktop version</span><input type="file" bind:this={imageDesktop} />
            </div>
            <input type="submit" class="button" value="ADD" />
          </form>
        {/if}

        <ul>
          {#each diagram.layers as layer, i}
            <li>
              {#if layer.card.heading === ''}
                Layer {i}
              {:else if editLayer === i}
                <form on:submit|preventDefault={() => updateLayer(editLayer)} class="form">
                  <div>
                    <span>Mobile version</span><input type="file" bind:this={imageMobile} />
                    <span>Desktop version</span><input type="file" bind:this={imageDesktop} />
                  </div>
                  <input type="submit" class="button" value="UPDATE" />
                </form>
              {:else}
                {layer.card.heading}
                <div class="icons">
                  <IconButton icon="edit" on:click={() => onClickEdit(i)} />
                  <IconButton icon="delete" on:click={() => onClickDeleteLayer(i)} />
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
      <div class="controls-diagram">
        <IconButton icon="delete" text="Delete diagram" on:click={controls.delete} />
        <IconButton icon={view} text="Change view" on:click={changeView} />
      </div>
    {/if}
  </div>
</div>
<div>
  <SortableList {list} key="id" on:sort={sortList} let:item>
    <span>{item.value.card.heading}</span>
  </SortableList>

  <pre>{JSON.stringify(list)}</pre>
</div>

<style lang="stylus">

  .diagram {
    flex: 1;
    display: grid;
    grid-template-columns: auto auto;
    column-gap: 20px;

    typography: ui-small;
    margin-bottom: 2rem;
  }

  .baselayer-img {
    margin-bottom: 20px;
    img {
      width: 800px;
    }
    .image-input {
      display: none;
    }
  }

  .cards {
    :global(.editor-buttons) {
      display: none;
    }
  }

  .column-2 {
    position: relative;
  }

  .layer-img {
    position: absolute;
    &:not(.layer-selected) {
      display: none;
    }
  }

  .layer-list {
    > ul {
      padding: 0;
      list-style-type: none;
      > li {
        display: flex;
        align-items: center;
        justify-content: space-between;

        :global(.icon-button::before) {
          background-color: transparent;
        }

        .icons {
          float: right;
          display: flex;
        }
      }
    }
  }

  .caption {
    margin-bottom: 22px;
    width: 160px;

    :global(.editable-text) {
      --outline-color: #d1d1d1;
      --caret-color: $colors.neutral-black;
    }
  }

    .resource {
      padding: 10px 10px 10px 25px;
      display: inline-grid;
      typography: ui-small;

      strong {
        position: absolute;
        transform: translate(-20px, 13px);
    }
  }

  .form {
    margin: 10px 0;

    input {
      border: none;
      text-decoration: none;
      margin: 5px;

      &:focus {
        outline: none;
        border-bottom: solid 1px;
      }
    }

    input[type=submit] {
      margin: 10px;
      padding: 10px 15px;
      border-radius: 5px;

      &:hover {
        filter: brightness(105%);
      }
    }
  }

  .controls-diagram {
    margin-top: 3rem ;
    align-items: center;

    :global(.icon-button::before) {
      background-color: transparent;
    }
  }

</style>
