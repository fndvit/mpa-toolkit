<script lang="ts">
  import GlobeViz from './GlobeViz.svelte';
  import { EditableText, IconButton, Spinner } from '$lib/components/generic';
  import { clickOutside, timedBoolean } from '$lib/helpers/utils';

  export let lat: number;
  export let long: number;

  let value: string = null;
  let loading = false;

  const { value: wiggling, start: wiggle } = timedBoolean();

  const save = (e?: Event) => {
    e?.stopPropagation();
    if (editorState.valid) {
      lat = editorState.lat;
      long = editorState.long;
      value = null;
    } else {
      wiggle(200);
    }
  };

  const cancel = () => (value = null);

  const parseInput = (value: string) => {
    const [lat, long] = (value || '').split(/[,\s]+/).map(v => parseFloat(v));
    return { lat, long, valid: !isNaN(lat) && !isNaN(long) };
  };

  $: editorState = parseInput(value);

  const onEditorKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && cancel();
  const onEditorKeyPress = (e: KeyboardEvent) => e.key === 'Enter' && save();

  let focus: () => void = undefined;

  $: {
    if (value == null) focus = undefined;
    else if (focus) focus();
  }
</script>

<div class="globe-editor" use:clickOutside={cancel} on:click={() => (value = value ?? `${lat}, ${long}`)}>
  {#if loading}
    <Spinner />
  {/if}

  <GlobeViz {lat} {long} bind:loading />

  {#if value == null}
    <div class="globe-edit-icon material-icons">edit</div>
  {:else}
    <div class="globe-editor-entry" class:wiggle={$wiggling}>
      <EditableText
        bind:focus
        bind:value
        on:keydown={onEditorKeyDown}
        on:keypress={onEditorKeyPress}
        editable
        placeholder="lat, long"
      />
      <IconButton icon="done" on:click={save} disabled={!editorState.valid} />
    </div>
  {/if}
</div>

<style lang="postcss">
  .globe-editor {
    cursor: pointer;

    &:hover {
      filter: brightness(105%);
    }

    :global(.spinner) {
      --spinner-color: white;
      --spinner-size: 50px;
      --spinner-thickness: 4px;

      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      z-index: 1;

      & + :global(.globe) {
        opacity: 0.5;
      }
    }
  }

  .globe-editor .globe-editor-entry {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: fit-content;
    width: calc(100% - 20px);
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $c-deep-blue;
    text-align: center;
    box-shadow: inset 0 2px 12px rgb(0 0 0 / 10%);
    padding: 0 2px;
    column-gap: 1px;

    --ib-color: rgb(112 167 112);
    --ib-icon-bg: none;
    --ib-hover-icon-bg: #fff2;
    --ib-bg-color: transparent;

    :global(.icon-button) {
      border: 1px solid #fff1;
    }

    :global(.editable-content) {
      font-size: 12px;
      padding: 0 0.5rem;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
    }

    &.wiggle {
      animation: wiggle 100ms ease-in-out infinite;
      color: rgb(194 87 87);
    }
  }
  @keyframes wiggle {
    0% {
      transform: translateX(0);
    }

    50% {
      transform: translateX(-2px);
    }

    100% {
      transform: translateX(0);
    }
  }

  .globe-edit-icon {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: fit-content;
    height: fit-content;
    font-size: 2rem;

    .globe-editor:not(:hover) & {
      display: none;
    }
  }
</style>
