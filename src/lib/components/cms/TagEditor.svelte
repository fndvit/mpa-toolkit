<script lang="ts">
  import IconButton from '../generic/IconButton.svelte';
  import EditableText from '$lib/components/generic/EditableText.svelte';
  import type { SubTypes } from '$lib/types';
  import { getToaster } from '$lib/helpers/utils';
  import { createTag, updateTag } from '$lib/api';

  export let tag: Pick<SubTypes.Tag, 'id' | 'value'>;
  export let loading: boolean;

  let editTag = tag.value;
  let focused = tag.id == null;

  const toaster = getToaster();

  const onClickSaveTag = async () => {
    loading = true;

    try {
      const apiCall = tag.id == null
        ? createTag({ value: editTag })
        : updateTag(tag.id, { value: editTag });
      const _tag = await apiCall;
      tag.id = _tag.id; // id from createTag
      tag.value = _tag.value;
      toaster('Tag saved', { type: 'done' });
      focused = false;
    }
    catch(e) {
      toaster('Error saving tag', { type: 'error' });
    }

    loading = false;
  };

  const onClickCancelTag = () => {
    if (tag.id == null) tag = undefined;
    else editTag = tag.value;
    focused = false;
  };

  $: if (!focused) onClickCancelTag();

</script>

<div class="tag-editor" class:editing={focused}>
  <EditableText
    bind:value={editTag}
    editable={true}
    placeholder="Tag name"
    bind:focused
  />
  <IconButton icon="done" on:click={onClickSaveTag} disabled={loading || editTag.trim().length === 0}/>
  <IconButton icon="close" on:click={onClickCancelTag} disabled={loading}/>
</div>

<style lang="stylus">
  .tag-editor {
    typography: ui;
    align-items: center;
    height: 25px;
    padding-left: 2px;
    display: flex;

    &:not(.editing) {
      :global([data-id="done"]),
      :global([data-id="close"]) {
        visibility: hidden;
      }
    }

    :global(.editable-text){
      --caret-color: $colors.neutral-black;
      --outline-color: $colors.neutral-black;
      flex: 1;
      margin-right 15px;
    }
  }
</style>
