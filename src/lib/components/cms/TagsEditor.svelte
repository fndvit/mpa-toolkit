<script lang="ts">
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import Searchbar from '$lib/components/generic/Searchbar.svelte';
  import TagEditor from '$lib/components/cms/TagEditor.svelte';
  import { openModal } from 'svelte-modals';
  import DeleteModal from '$lib/components/cms/DeleteModal.svelte';
  import { deleteTag } from '$lib/api';
  import Spinner from '$lib/components/generic/Spinner.svelte';
  import type { SubTypes } from '$lib/types';
  import { getToaster } from '$lib/helpers/utils';

  export let tags: SubTypes.Tag.WithPageCount[];

  let tagSearch = '';
  let filteredTags: SubTypes.Tag.WithPageCount[] = tags;
  let loading = false;

  let newTag: Pick<SubTypes.Tag, 'id' | 'value'>;

  const toaster = getToaster();

  const handleDelete = async (tag: SubTypes.Tag.WithPageCount) => {
    loading = true;

    if (tag.id !== null) {
      try {
        await deleteTag(tag.id);
        toaster('Tag deleted', { type: 'done' });
      }
      catch(e) {
        toaster('Error deleting tag', { type: 'error' });
        return;
      }
    }
    tags = tags.filter(_tag => _tag !== tag);
    loading = false;
  };


  const onClickDelete = async (tag: SubTypes.Tag.WithPageCount) => {
    if (tag._count.pageTags == 0) {
      await handleDelete(tag);
    } else {
      openModal(DeleteModal, {
        title: 'Delete Tag',
        message:
          'This tag is used on some pages. Are you sure you want to delete it?' +
          `It will be removed from ${tag._count?.pageTags} pages.`,
        confirmText: tag.value,
        onYes: () => handleDelete(tag),
      });
    }
  };

  const onClickAdd = () => newTag = { id: undefined, value: 'New Tag' };

  $: if (newTag?.id != null) { // new tag has been saved
    tags.push({ ...newTag, type: 'TOPIC', _count: { pageTags: 0 } });
    tags = tags.sort((a,b) => a.value > b.value ? 1 : -1);
    newTag = undefined;
  }

  $: searchRegex = new RegExp(tagSearch, 'i');
  $: filteredTags = tags.filter(tag => searchRegex.test(tag.value));

</script>

<div class="tags-container">
  <div class="tool-bar">
    <div class="tool-bar-item">
      <IconButton text="Add Tag" icon="add" on:click={onClickAdd} disabled={loading || !!newTag}/>
    </div>
    <div class="tool-bar-item">
      <Searchbar
        bind:search={tagSearch}
        type="top"
        placeholder={"Search a Tag..."}
        submit={null}
        />
    </div>
    <div class="spinner p-responsive" class:loading>
      Saving...<Spinner/>
    </div>
  </div>
  <ul class="tags-list">
    {#each filteredTags as tag (tag.id)}
      <li class="tag-row">
        <TagEditor bind:loading bind:tag />
        <span class="page-count">{tag._count?.pageTags} pages</span>
        <IconButton icon="delete" on:click={() => onClickDelete(tag)} disabled={loading}/>
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
    justify-content: center;
    column-gap: 15px;
    align-items: center;
    width: 100%;
    margin-top: 15px;
    margin-bottom: 20px;
  }
  .tool-bar-item {
    :global(.searchbar){
      :global(.placeholder){
        color: $colors.neutral-black;
      }
      :global(.input-text){
        color: $colors.neutral-black;
      }
    }
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
