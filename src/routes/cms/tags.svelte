<script lang="ts">
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import Searchbar from '$lib/components/generic/Searchbar.svelte';
  import type { Tag } from '$lib/types';
  import { TagType } from '$lib/types';
  import EditableText from '$lib/components/generic/EditableText.svelte';
  import { getContext } from 'svelte';
  import type Toaster from '$lib/components/generic/Toaster.svelte';
  import DeleteModal from '$lib/components/cms/DeleteModal.svelte';
  import { openModal } from 'svelte-modals';
  import { createTag, deleteTag, updateTag } from '$lib/prisma/wrappers';


  export let tags: (Tag & {_count: {pageTags: number}})[];

  let tagFocused = -1;
  let editableTag: EditableText;

  const addToastMessage = getContext<Toaster['$$prop_def']['addMessage']>('addToastMessage');

  const addNewTagDB = async (tag: Tag) => {
    try {
      await createTag(tag)
      addToastMessage('Tag updated', {  type: 'done'});
    } catch (error) {
      addToastMessage('Error creating tag', {  type: 'error'});
    }
  }

  const updateTagDB = async (tag: Tag) => {
    try {
      await updateTag(tag.id, tag)
      addToastMessage('Tag updated', {  type: 'done'});
    } catch (error) {
      addToastMessage('Error updating tag', {  type: 'error'});
    }
  }

  const deleteTagDB = async (tag: Tag) => {
    try {
      await deleteTag(tag.id)
      addToastMessage('Tag deleted', {  type: 'done'});
    } catch (error) {
      addToastMessage('Error deleting tag', {  type: 'error'});
    }
  }

  const addNewTag = (tag: Tag) => {

    tags.push({
      value: 'New Tag',
      type: TagType.TOPIC,
      id: null,
      _count: {
        pageTags: 0
      }
    })
    tags = tags
    tagFocused = tags.length - 1;
    addToastMessage('New tag added', { type: 'done' });
  };

  const removeTag = (i: number) => {
    if(tags[i]._count.pageTags > 0){
      openModal(DeleteModal, {
        title: 'Delete Tag',
        message: 'This tag is used on some pages. Are you sure you want to delete it? It will be removed from ' + tags[i]._count.pageTags + ' pages.',
        confirmText: tags[i].value,
        onYes: () => {
          deleteTagDB(tags[i]).then(() => {
            tags.splice(i, 1);
            tagFocused = -1;
            tags = tags;
          });
        }
      });
    } else {
      deleteTagDB(tags[i]).then(() => {
            tags.splice(i, 1);
            tagFocused = -1;
            tags = tags;
        });
    }
  };

  const cancelTagEditon = (i: number) => {
    tags[i].value = tags[i].value;
    tags = tags;
    tagFocused = -1;
  };

  const saveTag = (i: number) => {
    if(tags[i].value.trim() === ''){
      addToastMessage('Tag cannot be empty', {type: 'error'});
      return;
    }
    if (tags[i].id === null) {
      addNewTagDB(tags[i]);
    } else {
      updateTagDB(tags[i]);
    }
    tags = tags;
    tagFocused = -1;
  }

  $: console.log(editableTag)
</script>

<div class="tags-container">
  <div class="tool-bar">
    <div class="tool-bar-item">
      <IconButton text="Add Tag" icon="add" on:click={addNewTag} />
    </div>
    <div class="tool-bar-item">
      <Searchbar type='top'/>
    </div>
    <div class="sort-bar-item">
      <IconButton text="Sort" icon="sort" />
    </div>

  </div>
  <div class="tags-list">
        {#each tags as tag, i}
            <div class="tag">
              <EditableText bind:value={tag.value} editable={true} placeholder="Tag name" on:focus={() => tagFocused = tag.id} on:focusout={() => {cancelTagEditon(tagFocused)}}/>
              <p>- Frequency: {tag._count.pageTags}</p>
              {#if tagFocused === tag.id}
                <IconButton icon='done' on:click={() => saveTag(i)}/>
                <IconButton icon='close' on:click={() => cancelTagEditon(i)}/>
              {/if}
                <div class="delete-year-button" on:click={() => deleteTag(i)}>
                  <IconButton icon="delete"/>
                </div>
            </div>
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
  }
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