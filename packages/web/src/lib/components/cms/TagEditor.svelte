<script lang="ts">
  import type { Tag } from '@mpa/db';
  import { toaster } from '../generic/Toaster';
  import * as api from '$lib/api';
  import { EditableText, IconButton } from '$lib/components/generic';

  export let tag: Pick<Tag, 'id' | 'value'>;
  export let loading: boolean;

  let editTag = tag.value;
  let focused = tag.id == null;

  const onClickSaveTag = async () => {
    loading = true;

    try {
      const apiCall = tag.id == null ? api.tag.create({ value: editTag }) : api.tag.update(tag.id, { value: editTag });
      const _tag = await apiCall;
      tag.id = _tag.id; // id from createTag
      tag.value = _tag.value;
      toaster.done('Tag saved');
      focused = false;
    } catch (e) {
      toaster.error('Error saving tag');
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
  <EditableText bind:value={editTag} editable={true} placeholder="Tag name" bind:focused />
  <IconButton icon="done" on:click={onClickSaveTag} disabled={loading || editTag.trim().length === 0} />
  <IconButton icon="close" on:click={onClickCancelTag} disabled={loading} />
</div>

<style lang="postcss">
  .tag-editor {
    font: $f-ui;
    align-items: center;
    height: 25px;
    padding-left: 2px;
    display: flex;

    &:not(.editing) {
      :global([data-id='done']),
      :global([data-id='close']) {
        visibility: hidden;
      }
    }

    :global(.editable-text) {
      --editable-caret: $c-neutral-black;
      --editable-outline: $c-neutral-black;

      flex: 1;
      margin-right: 15px;
    }
  }
</style>
