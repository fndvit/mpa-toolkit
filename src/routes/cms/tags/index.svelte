<script lang="ts">
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import Searchbar from '$lib/components/generic/Searchbar.svelte';
  import type { Tag } from '$lib/types';
  import { TagType } from '@prisma/client';
  import { getContext } from 'svelte';
  import type Toaster from '$lib/components/generic/Toaster.svelte';
  import TagEditor from '$lib/components/cms/TagEditor.svelte';
  import { openModal } from 'svelte-modals';
  import DeleteModal from '$lib/components/cms/DeleteModal.svelte';
  import { deleteTag, createTag, updateTag } from '$lib/api';
  import Spinner from '$lib/components/generic/Spinner.svelte';

  export let tags: Tag[];
  export let savingTag = false;

  let tagSearch = '';
  let filtredTags: Tag[] = tags;

  const addToastMessage = getContext<Toaster['$$prop_def']['addMessage']>('addToastMessage');
  const onDeleteTag = async (tag: Tag) => {
    if(tag._count.pageTags > 0){
      openModal(DeleteModal, {
        title: 'Delete Tag',
        message:
          'This tag is used on some pages. Are you sure you want to delete it? It will be removed from ' +
          tag._count?.pageTags +
          ' pages.',
        confirmText: tag.value,
        onYes: async () => {
          savingTag = true;

          await deleteTag(tag.id).then(() => {
            addToastMessage('Tag deleted', { type: 'done' });
            tags.splice(tags.indexOf(tag), 1);
            tags = tags;
          }).catch(() => {
            addToastMessage('Error deleting tag', { type: 'error' });
          });

          savingTag = false;
        }
      });
    } else {
      savingTag = true;

      await deleteTag(tag.id).then(() => {
        addToastMessage('Tag deleted', { type: 'done' });
        tags.splice(tags.indexOf(tag), 1);
        tags = tags;
      }).catch(() => {
        addToastMessage('Error deleting tag', { type: 'error' });
      });

      savingTag = false;
    }
  };
  const onSaveTag = async (tag: Tag) => {
    savingTag = true;

    if (tag.id) {
      await updateTag(tag.id, tag).then(() => {
        addToastMessage('Tag updated', { type: 'done' });
      }).catch(() => {
        addToastMessage('Error updating tag', { type: 'error' });
      });
    } else {
      await createTag(tag).then(() => {
        addToastMessage('Tag created', { type: 'done' });
      }).catch(() => {
        addToastMessage('Error creating tag', { type: 'error' });
      });
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
  };

  $: {
    filtredTags = tags.filter(tag => (tag.value.toLowerCase().search(tagSearch.toLowerCase()) !== -1 || tagSearch.length === 0));
    filtredTags = filtredTags;
  }
</script>

<div class="tags-container">
  <div class="tool-bar">
    <div class="tool-bar-item">
      <IconButton text="Add Tag" icon="add" on:click={onClickAdd} disabled={savingTag}/>
    </div>
    <div class="tool-bar-item">
      <Searchbar bind:search={tagSearch} type="top" placeholder={"Search a Tag..."} />
    </div>
    {#if savingTag}
    <p>Saving</p><Spinner/>
    {/if}
  </div>
  <div class="tags-list">
    {#each filtredTags as tag}
      <TagEditor disabled={savingTag} {tag} on:delete={({ detail }) => onDeleteTag(detail)} on:saveTag={({ detail }) => onSaveTag(detail)} />
    {/each}
  </div>
</div>

<style lang="stylus">
  .tags-list{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  .tool-bar{
    display: flex;
    justify-content: center
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
    p{
      margin-right: 10px;
      margin-left: 10px;
    }
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
</style>
