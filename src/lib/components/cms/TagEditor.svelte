<script lang="ts">
  import IconButton from '../generic/IconButton.svelte';
  import EditableText from '$lib/components/generic/EditableText.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { SubTypes } from '$lib/types';


  export let tag: SubTypes.Tag.WithPageCount;
  export let disabled = false;
  export let tagFocused = tag.id === null;

  let editTag = tag.value;
  let saveTag = false;
  let editableTag: EditableText;

  const dispatch = createEventDispatcher<{saveTag: SubTypes.Tag.WithPageCount, delete: SubTypes.Tag.WithPageCount}>();

  const onClickSaveTag = () => {
    tag.value = editTag;
    saveTag = true;
    editableTag.blur();
    tagFocused = false;
    dispatch('saveTag', tag);
  };

  const onClickCancelTag = () => {
    editTag = tag.value;
    editableTag?.blur();
    tagFocused = false;
    if(tag.id === null) dispatch('delete', tag);
  };

  const onClickDeleteTag = () => {
    dispatch('delete', tag);
  };

  $: if(!tagFocused && !saveTag) onClickCancelTag();
     else saveTag = false;
</script>

<div class="tag" class:editing={tagFocused}>
  <div class="value-editor">
    <EditableText
      bind:this={editableTag}
      bind:value={editTag}
      editable={true}
      placeholder="Tag name"
      bind:focused={tagFocused}
    />
    <IconButton icon="done" on:click={onClickSaveTag} {disabled}/>
    <IconButton icon="close" on:click={onClickCancelTag} {disabled}/>
  </div>

  <div class="col-2">
    <span class="page-count">{tag._count?.pageTags} pages</span>
    {#if tag.id}
    <IconButton icon="delete" on:click={onClickDeleteTag} {disabled}/>
    {/if}
  </div>


</div>

<style lang="stylus">
  .tag {
    typography: ui;
    display: contents;
    align-items: center;
    height: 25px;
    padding-left: 2px;

    &:not(.editing) {
      :global([data-id="done"]),
      :global([data-id="close"]) {
        visibility: hidden;
      }
    }

    :global(.editable-text){
      --caret-color: $colors.neutral-black;
      --outline-color: $colors.neutral-black;
    }
    :global(.icon-button){
      --ib-size: 20px;
    }
  }

  .value-editor {
    display: flex;
    > :global(.editable-text) {
      flex: 1;
      margin-right: 10px;
    }
  }

  .page-count {
    text-align: right;
  }

  .col-2{
    display: flex;
    column-gap: 10px;
  }
</style>
