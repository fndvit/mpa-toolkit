<script lang="ts">
  import type { ImageBlock } from '@mpa/db';
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import imagePlaceholder from '$lib/assets/image-placeholder.svg';
  import { IconButton } from '$lib/components/generic';
  import Picture from '$lib/components/generic/Picture.svelte';
  import { IMAGE_CONFIG } from '$lib/components/page/body/Image.svelte';

  export var attrs: ImageBlock['attrs'];
  export var controls: SvelteNodeViewControls;
  export var selected = false;

  let editing = false;

  const toggleStyle = () => {
    attrs.style = attrs.style === 'regular' ? 'full' : 'regular';
  };
</script>

<div
  class="imageview imageview-{attrs.style}"
  class:selected
  class:imageview--editing={editing}
  contenteditable="false"
>
  <div class="image-controls" on:focusin={() => (editing = true)} on:focusout={() => (editing = false)}>
    <input bind:value={attrs.alt} placeholder="alt text..." />
    <input bind:value={attrs.credits} placeholder="pciture credits..." />
    <IconButton icon="aspect_ratio" title="Wide" active={attrs.style === 'full'} on:click={toggleStyle} />
    <IconButton on:click={controls.delete} icon="delete" />
  </div>
  <Picture
    src={attrs.src}
    fallback={imagePlaceholder}
    alt={attrs.alt}
    title={attrs.title}
    config={IMAGE_CONFIG[attrs.style || 'regular']}
  />
</div>

<style lang="postcss">
  :global(.svelte-node-view.ProseMirror-selectednode) .imageview {
    outline: 1px solid #333a;
  }

  .imageview {
    font-size: 0;
    position: relative;

    &.selected::before {
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

    :global(img) {
      width: 100%;
    }
  }

  .imageview-full {
    margin-left: -100px;
    margin-right: -100px;
  }

  .image-controls {
    --ib-icon-bg: #fff7;
    --ib-hover-icon-bg: #fffc;

    .imageview-full & :global([data-id='aspect_ratio']) {
      --ib-active-bg: white;
    }

    padding: 5px;
    font-size: 16px;
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;

    .imageview:not(.imageview--editing, :hover) & {
      display: none;
    }

    display: flex;
    column-gap: 5px;

    input {
      flex: 1;
    }
  }
</style>
