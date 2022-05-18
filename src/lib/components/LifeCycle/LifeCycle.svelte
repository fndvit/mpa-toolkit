<script lang='ts'>
  import type { PageTag } from '$lib/types';
  import { groupBy } from '$lib/helpers/utils';
  import type { Tag } from '$lib/types';
  import MultiSelect, { Option } from 'svelte-multiselect';
  import CircleMenu, { type MenuElement } from '../CircleMenu/CircleMenu.svelte';
  import TagContainer from  '../Tags/TagContainer.svelte';

  export let allTags: Tag[] = null;
  export let tags: PageTag[]; // binding (updated as tags are changed)
  export let editable: boolean = false;

  const LIFECYCLE_CONFIG = [20, 20, 10, 5, 5, 10, 30];

  const MAX_PRIMARY_TAGS = 2;
  const MAX_SECONDARY_TAGS = 7;

  type PageTagOption = PageTag & Option;

  // used internally to bind to multiselect & keep track of selected tags
  const selectedTagOptions = groupBy(
    tags.map<PageTagOption>(t => ({value: t.tag.id, label: t.tag.value, tag: t.tag, category: t.category})),
    t => t.tag.type === 'STAGE' ? t.category : t.tag.type
  );

  const allPageTagOptions = editable && allTags.map<PageTagOption>(
    tag => ({ value: tag.id, label: tag.value, tag, category: 'PRIMARY' })
  );
  const groupedOptions = editable && groupBy(allPageTagOptions, ({tag}) => tag.type);

  $: selectedStageTagIds = new Set(
    [...tags.filter(({tag}) => tag.type === 'STAGE').map(({tag}) => tag.id)]
  );

  $: availableStageOptions = editable && groupedOptions.STAGE
    .filter(({tag}) => !selectedStageTagIds.has(tag.id));

  $: if (editable) {
    tags = Object.values(selectedTagOptions).flat().map(o =>
      ({ tag: o.tag, category: o.category })
    );
  }

  $: renderTags = !editable && groupBy(tags, t => t.tag.type);

  $: menuData = LIFECYCLE_CONFIG.map<MenuElement>((percentage, i) => {
    const category = tags.find(({tag}) => tag.id === i)?.category;
    return {
      percentage,
      type: category === 'PRIMARY' ? 'main' : category === 'SECONDARY' ? 'secondary' : 'unselected'
    }
  });

</script>

<div class='container'>
  <h5 class='title'>Where in the MPA lifecycle?</h5>
  <div class="circle-menu-section">
      <div class="circle-menu">
          <CircleMenu data={menuData} />
      </div>
      <div class="tag-container">
        {#if editable}
          <div class="subtitle">Primary Tags</div>
          <MultiSelect
            bind:selected={selectedTagOptions.PRIMARY}
            options={availableStageOptions}
            maxSelect={MAX_PRIMARY_TAGS}
          />
          <div class="subtitle">Secondary Tags</div>
          <MultiSelect
            bind:selected={selectedTagOptions.SECONDARY}
            options={availableStageOptions.map(o => ({...o, category: 'SECONDARY'}))}
            maxSelect={MAX_SECONDARY_TAGS}
          />
        {:else}
          <TagContainer tags={renderTags.STAGE} />
        {/if}
      </div>
  </div>
  <div class="bottom-section">
    <h5 class='title'>What&apos;s this about</h5>
    <div class="tag-container">
      {#if editable}
        <MultiSelect bind:selected={selectedTagOptions.TOPIC} options={groupedOptions.TOPIC} />
      {:else}
        <TagContainer tags={renderTags.TOPIC} />
      {/if}
    </div>
    <h5 class='title'>Good for ...</h5>
    <div class="tag-container">
      {#if editable}
        <MultiSelect bind:selected={selectedTagOptions.USER} options={groupedOptions.USER} />
      {:else}
        <TagContainer tags={renderTags.USER} />
      {/if}
    </div>
  </div>

</div>

<style lang="scss">
  .container {
    width: 294px;
    height: auto;
    background: #66CFD6;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    padding-bottom: 20px;
  }
  .title {
    width: 145px;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: #000000;
    padding-left: 20px;
    padding-top: 20px;
    padding-bottom: 0px;
    margin-bottom: 10px;
    margin-top: 0px;
  }
  .tag-container {
    margin-left: 20px;
    margin-right: 20px;
  }
  @media (max-width: 900px) {
    .container {
      width: 372px;
    }
    .title {
      width: auto;
      font-size: 10px;
    }
    .circle-menu {
      :global(svg) {
        width: 100%;
      }
    }
    .circle-menu-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .circle-menu-section .tag-container {
      text-align: center;
    }
    .bottom-section {
      :global(.tag-container) {
        white-space: nowrap;
        overflow-x: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      :global(.tag-container::-webkit-scrollbar) {
        display: none;
      }
    }
  }

  :global(.multiselect .selected) {
    font-size: 10px;
  }
</style>