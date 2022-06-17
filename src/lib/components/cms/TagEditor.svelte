<script lang="ts">
  import IconButton from '../generic/IconButton.svelte';
  import type { Tag } from '$lib/types';
  import { TagType } from '@prisma/client';
  import DeleteModal from '$lib/components/cms/DeleteModal.svelte';
  import { openModal } from 'svelte-modals';
  import { createTag, deleteTag, updateTag } from '$lib/api';
  import EditableText from '$lib/components/generic/EditableText.svelte';
  import { createEventDispatcher, getContext } from 'svelte';
  import type Toaster from '$lib/components/generic/Toaster.svelte';

  export let tag: (Tag & {_count: {pageTags: number}});

  let editTag = tag.value;
  let tagFocused = false;
  let editableTag: EditableText;

  const dispatch = createEventDispatcher<{saveTag: string, delete: (Tag & {_count: {pageTags: number}})}>();

  const onClickSaveTag = () => {
    dispatch('saveTag', editTag);
    tag.value = editTag;
    editableTag.blur();
  };

  const onClickCancelTag = () => {
    editTag = tag.value;
    editableTag.blur();
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
  <p>- Frequency: {tag._count.pageTags}</p>
  {#if tagFocused}
    <IconButton icon="done" on:click={onClickSaveTag}/>
    <IconButton icon="close" on:click={onClickCancelTag}/>
  {/if}
  <div class="delete-year-button">
    <IconButton icon="delete" on:click={onClickDeleteTag}/>
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
