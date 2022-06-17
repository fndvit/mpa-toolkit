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
import { deleteTag } from '$lib/api';

  export let tags: (Tag & { _count: { pageTags: number } })[];

  const addToastMessage = getContext<Toaster['$$prop_def']['addMessage']>('addToastMessage');
  const onDeleteTag = (tag: (Tag & { _count: { pageTags: number } })) => {
    console.log(tag)
    openModal(DeleteModal, {
        title: 'Delete Tag',
        message: 'This tag is used on some pages. Are you sure you want to delete it? It will be removed from ' + tag._count.pageTags + ' pages.',
        confirmText: tag.value,
        onYes: () => {
          deleteTag(tag.id).then(() => {
            addToastMessage('Tag deleted', {type: 'done'});
            tags.slice(tags.indexOf(tag), 1);
            tags = tags;
          });
        }
      });
  }
  const onSaveTag = (tag) => {

  }
  const onClickAdd = () => {
    tags.push({
      value: 'New Tag',
      type: TagType.TOPIC,
      id: null,
      _count: {
        pageTags: 0
      }
    });
    tags = tags;
  };
</script>

<div class="tags-container">
  <div class="tool-bar">
    <div class="tool-bar-item">
      <IconButton text="Add Tag" icon="add" on:click={onClickAdd} />
    </div>
    <div class="tool-bar-item">
      <Searchbar type="top" />
    </div>
    <div class="sort-bar-item">
      <IconButton text="Sort" icon="sort" />
    </div>
  </div>
  <div class="tags-list">
    {#each tags as tag}
      <TagEditor {tag} on:delete={({detail}) => onDeleteTag(detail)}/>
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
</style>
