<script lang="ts">
  import IconButton from '../generic/IconButton.svelte';
  import EditableText from '$lib/components/generic/EditableText.svelte';
  import { createEventDispatcher } from 'svelte';
import type { SubTypes } from '$lib/types';


  export let tag: SubTypes.Tag.Count;
  export let disabled = false;

  let editTag = tag.value;
  let tagFocused = false;
  let editableTag: EditableText;

  const dispatch = createEventDispatcher<{saveTag: SubTypes.Tag.Count, delete: SubTypes.Tag.Count}>();

  const onClickSaveTag = () => {
    tag.value = editTag;
    editableTag.blur();
    tagFocused = false;
    dispatch('saveTag', tag);
  };

  const onClickCancelTag = () => {
    editTag = tag.value;
    editableTag.blur();
    tagFocused = false;
  };

  const onClickDeleteTag = () => {
    dispatch('delete', tag);
  };
</script>

<div class="tag">
  <EditableText
    bind:this={editableTag}
    bind:value={editTag}
    editable={true}
    placeholder="Tag name"
    bind:focused={tagFocused}
  />
  <p>- Frequency: {tag._count?.pageTags}</p>
  {#if tagFocused }
    <IconButton icon="done" on:click={onClickSaveTag} {disabled}/>
    <IconButton icon="close" on:click={onClickCancelTag} {disabled}/>
  {/if}
  <div class="delete-year-button">
    <IconButton icon="delete" on:click={onClickDeleteTag} {disabled}/>
  </div>
</div>

<style lang="stylus">
  .tag{
    typography: ui-small;
    display: flex;
    column-gap: 5px;
    align-items: center;
    height: 25px;
    padding-left: 2px;
    :global(input) {
      width: 40px;
    }
    :global(.editable-text){
      --caret-color: $colors.neutral-black;
      --outline-color: $colors.neutral-black;
    }
    :global(.icon-button){
      --ib-size: 20px;
    }
  }
</style>
