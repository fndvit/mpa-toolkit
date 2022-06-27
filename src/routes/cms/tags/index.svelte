<script lang="ts">
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import Searchbar from '$lib/components/generic/Searchbar.svelte';
  import { TagType } from '@prisma/client';
  import { getContext } from 'svelte';
  import type Toaster from '$lib/components/generic/Toaster.svelte';
  import TagEditor from '$lib/components/cms/TagEditor.svelte';
  import { openModal } from 'svelte-modals';
  import DeleteModal from '$lib/components/cms/DeleteModal.svelte';
  import { deleteTag, createTag, updateTag } from '$lib/api';
  import Spinner from '$lib/components/generic/Spinner.svelte';
  import type { SubTypes } from '$lib/types';
  import { getToaster } from '$lib/helpers/utils';

  export let tags: SubTypes.Tag.WithPageCount[];
  export let savingTag = false;

  let tagSearch = '';
  let filteredTags: SubTypes.Tag.WithPageCount[] = tags;
  let newTag = false;

  const toaster = getToaster();
  const onDeleteTag = async (tag: SubTypes.Tag.WithPageCount) => {

    savingTag = true;

    try{

      let localDelete = !tag.id;
      let confirmDelete = tag._count.pageTags === 0;

      if(tag._count.pageTags > 0){
        openModal(DeleteModal, {
          title: 'Delete Tag',
          message:
            'This tag is used on some pages. Are you sure you want to delete it? It will be removed from ' +
            tag._count?.pageTags +
            ' pages.',
          confirmText: tag.value,
          onYes: async () => confirmDelete = true,
        });
      }
      if(confirmDelete && !localDelete){
        await deleteTag(tag.id);
        tags = tags.filter(t => t.id !== tag.id);
      }
      else{
        tags = tags.filter(t => t.value !== tag.value);
        newTag = false;
      }

      toaster('Tag deleted', { type: 'done' });

    }catch(e){
      toaster('Error deleting tag', { type: 'error' });
    }

    savingTag = false;

  };
  const onSaveTag = async (tag: SubTypes.Tag.WithPageCount) => {

    savingTag = true;

    if(tag.value.trim() === ''){
      toaster('Tag cannot be empty', { type: 'error' });
      savingTag = false;
      return;
    }

    try{

      if (tag.id) {
        await updateTag(tag.id, tag);
      } else {
        let res = await createTag(tag);
        tags.find(t => t.value === res.value).id = res.id;
        newTag = false;
      }
      toaster('Tag saved', { type: 'done' });
    }
    catch(e){
      toaster('Error saving tag', { type: 'error' });
    }

    savingTag = false;

  };
  const onClickAdd = () => {
    tags.push({
        value: 'New Tag',
        type: TagType.TOPIC,
        id: null,
        _count:{
          pageTags: 0
        }
    });
    tags = tags;
    newTag = true;
  };

  $: {
    let regExp = new RegExp(tagSearch, 'i');
    filteredTags = tags.filter(tag => regExp.test(tag.value) || tag.id === null);
  }

</script>

<div class="tags-container">
  <div class="tool-bar">
    <div class="tool-bar-item">
      <IconButton text="Add Tag" icon="add" on:click={onClickAdd} disabled={savingTag || newTag}/>
    </div>
    <div class="tool-bar-item">
      <Searchbar
        bind:search={tagSearch}
        type="top"
        placeholder={"Search a Tag..."}
        submit={null}
        />
    </div>
    <div class="spinner p-responsive" class:savingTag>
      Saving...<Spinner/>
    </div>
  </div>
  <div class="tags-list">
    {#each filteredTags as tag}
      <TagEditor
        disabled={savingTag}
        {tag}
        on:delete={({ detail }) => onDeleteTag(detail)}
        on:saveTag={({ detail }) => onSaveTag(detail)}
      />
    {/each}
  </div>
</div>

<style lang="stylus">
  .tags-container {
    font-family: var(--font-sans-serif);
  }
  .tags-list{
    display: grid;
    grid-template-columns: auto auto;
    row-gap: 15px;
    column-gap: 15px;
    margin: auto;
    width: fit-content;
  }
  .tool-bar{
    display: flex;
    justify-content: center;
    column-gap: 15px;
    align-items: center;
    width: 100%;
    margin-top: 15px;
    margin-bottom: 20px;
  }
  .tool-bar-item{
    :global(.searchbar){
      :global(.placeholder){
        color: $colors.neutral-black;
      }
      :global(.input-text){
        color: $colors.neutral-black;
      }
    }
  }
  .spinner{
    opacity: 0;
    display: flex;
    align-items: center;
    column-gap: 15px;
  }

  .savingTag{
    opacity: 1 !important
  }
</style>
