<script lang="ts">
  import { staticUrl } from "$lib/helpers/content";
  import type { ImageBlock } from "$lib/types";

  export var attrs: ImageBlock['attrs'];
  export var selected = false;

  const styles: [ImageBlock['attrs']['style'], string][] = [
    ['regular', 'Regular'],
    ['full', 'Wide'],
  ];

</script>

<div class="imageview imageview-{attrs.style}" class:selected>
  <div class="image-controls">
    {#each styles as [style, label]}
      <button class:active={attrs.style === style} on:click={() => attrs.style = style}>{label}</button>
    {/each}
    <input bind:value={attrs.alt} placeholder="alt text..."/>
  </div>
  <img src={staticUrl(attrs.src)} alt={attrs.alt} title={attrs.title} />
</div>

<style lang="scss">

  :global(.svelte-node-view.ProseMirror-selectednode) .imageview {
    outline: 1px solid #333333aa;
  }

  .imageview {
    font-size: 0;
    position: relative;
    &.selected:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border: 1px solid #777;
      margin: -1px;
      pointer-events: none;
    }
  }

  .imageview-full {
    margin-left: -100px;
    margin-right: -100px;
  }

  .image-controls {
    padding: 5px;
    font-size: 16px;
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;;
    .imageview:not(:hover) & {
      display: none;
    }
    display: flex;
    column-gap: 5px;
    button {
      cursor: pointer;
      padding: 2px 5px;
      border: 1px solid #999;
      color: #222;
      border-radius: 2px;
      &:hover {
        filter: brightness(95%);
      }
    }
    button.active {
      border: 1px solid black;
      font-weight: 500;
      color: black;
    }
    input {
      flex: 1;
    }
  }

  img {
    width: 100%;
  }

</style>