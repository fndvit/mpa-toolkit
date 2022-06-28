<script lang="ts">
  import IconButton from '../generic/IconButton.svelte';
  import EditableText from '$lib/components/generic/EditableText.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { SubTypes } from '$lib/types';



  export let tag: SubTypes.Tag.WithPageCount;
  export let disabled = false;
  export let tagFocused = tag.id === null;

  export const updateCB = (state: string) => {
    switch (state) {
      case 'error':
        editTag = tag.value;
        tag.value = initialValue;
        editableTag?.focus();
        break;
      case 'saved':
        initialValue = tag.value;
        editTag = tag.value;
        editableTag?.blur();
        break;
      default:
        console.error('Unknown state: ', state);
        break;
    }
    saving = false;
  };

  let editTag = tag.value;
  let initialValue = tag.value;
  let editableTag: EditableText;
  let saving: boolean = false;

  const dispatch = createEventDispatcher<{saveTag: {tag: SubTypes.Tag.WithPageCount, updateCB: (state: string) => void }, delete: SubTypes.Tag.WithPageCount}>();


  const onClickSaveTag = () => {
    saving = true;

    tag.value =  editTag;

    editableTag?.blur();

    dispatch('saveTag', {tag: tag, updateCB: updateCB});
  };


  const onClickCancelTag = () => {
    if(!saving){
      editTag = tag.value;

      editableTag?.blur();

      if(tag.id === null) onClickDeleteTag(); //It's a new tag (not saved on the DB), so delete it
    }
  };


  const onClickDeleteTag = () => {
    dispatch('delete', tag);
  };

  $: tagFocused ? null : onClickCancelTag();

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
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 10px;
  }
</style>
