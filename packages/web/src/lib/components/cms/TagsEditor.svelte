<script lang="ts">
  import type { Tag } from '@mpa/db';
  import { openModal } from 'svelte-modals';
  import TagEditor from './TagEditor.svelte';
  import { DeleteModal, IconButton, Spinner, toaster } from '$lib/components/generic';
  import * as api from '$lib/api';

  export let tags: Tag.WithPageCount[];

  let loading = false;

  let newTag: Pick<Tag, 'id' | 'value'>;

  const handleDelete = async (tag: Tag.WithPageCount) => {
    loading = true;

    if (tag.id !== null) {
      try {
        await api.tag.delete(tag.id);
        toaster.done('Tag deleted');
      } catch (e) {
        toaster.error('Error deleting tag');
        return;
      }
    }
    tags = tags.filter(_tag => _tag !== tag);
    loading = false;
  };

  const onClickDelete = async (tag: Tag.WithPageCount) => {
    if (tag._count.pageTags == 0) {
      await handleDelete(tag);
    } else {
      openModal(DeleteModal, {
        title: 'Delete Tag',
        message:
          'This tag is used on some pages. Are you sure you want to delete it?' +
          `It will be removed from ${tag._count?.pageTags} pages.`,
        confirmText: tag.value,
        onYes: () => handleDelete(tag)
      });
    }
  };

  const onClickAdd = () => (newTag = { id: undefined, value: 'New Tag' });

  $: if (newTag?.id != null) {
    // new tag has been saved
    tags.push({ ...newTag, type: 'TOPIC', _count: { pageTags: 0 } });
    tags = tags.sort((a, b) => (a.value > b.value ? 1 : -1));
    newTag = undefined;
  }
</script>

<div class="tags-container">
  <div class="tool-bar">
    <IconButton text="Add Tag" icon="add" on:click={onClickAdd} disabled={loading || !!newTag} />
    <div class="spinner p-responsive" class:loading>
      Saving...<Spinner />
    </div>
  </div>
  <ul class="tags-list">
    {#each tags as tag (tag.id)}
      <li class="tag-row">
        <TagEditor bind:loading bind:tag />
        <span class="page-count">{tag._count?.pageTags} pages</span>
        <IconButton icon="delete" on:click={() => onClickDelete(tag)} disabled={loading} />
      </li>
    {/each}

    {#if newTag}
      <li class="tag-row">
        <TagEditor bind:loading bind:tag={newTag} />
      </li>
    {/if}
  </ul>
</div>

<style lang="stylus">
  .tags-container {
    font-family: var(--font-sans-serif);
    width: fit-content;
    margin: auto;
  }
  .tags-list {
    display: grid;
    grid-template-columns: auto auto 1fr;
    width: 500px;
    row-gap: 15px;
    column-gap: 15px;
    margin: auto;
    width: fit-content;
    padding: 0;
    list-style: none;
    :global(.icon-button){
      --ib-size: 20px;
    }
  }
  .tag-row {
    display: contents;
  }
  .tool-bar {
    display: flex;
    column-gap: 15px;
    width: 100%;
    margin-top: 15px;
    margin-bottom: 30px;
  }
  .spinner {
    display: flex;
    align-items: center;
    column-gap: 15px;
    &:not(.loading) {
      visibility: hidden;
    }
  }
</style>
