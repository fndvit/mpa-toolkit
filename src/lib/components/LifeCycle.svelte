<script lang='ts'>
  import type { SubTypes, Tag } from '$lib/types';
  import { groupBy } from '$lib/helpers/utils';
  import MultiSelect, { Option } from 'svelte-multiselect';
  import CircleMenu, { type MenuElement } from './CircleMenu.svelte';
  import TagContainer from  './TagContainer.svelte';
  import textFit from 'textfit';
  import { afterUpdate } from 'svelte';
  import HelpPopup from './HelpPopup.svelte';


  export let allTags: Tag[] = null;
  export let tags: SubTypes.PageTag[]; // binding (updated as tags are changed)
  export let editable = false;

  let currentTagHovered: number = -1;
  let infoTextElement: HTMLElement;

  const helpText = '<b>What is the MPA lifecycle</b>'
  const fitTextOptions = {
    alignVert: true,
    alignHoriz: true,
    multiLine: true
  };
  const LIFECYCLE_CONFIG = [20, 20, 10, 5, 5, 10, 30]; // index matches tag id
  const LIFECYCLE_TEXT = [
    'Although there is no single recipe, there ways to optimize the <b>design</b> of your MPA based on your specific needs.',
    '<b>Where does this fit in the MPA management lifecycle?</b>',
    '<b>Where does this fit in the MPA management lifecycle?</b>',
    '<b>Where does this fit in the MPA management lifecycle?</b>',
    '<b>Where does this fit in the MPA management lifecycle?</b>',
    '<b>Where does this fit in the MPA management lifecycle?</b>',
    '<b>Where does this fit in the MPA management lifecycle?</b>',
  ]; // index matches tag id

  const MAX_PRIMARY_TAGS = 2;
  const MAX_SECONDARY_TAGS = 7;

  type PageTagOption = SubTypes.PageTag & Option;

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
    };
  });


  afterUpdate(() => {
	  if(infoTextElement) textFit(infoTextElement, fitTextOptions);
  });
</script>

<div class='lifecycle'>
  <div class='top-section'>
    <h5 class='title'>Where in the MPA lifecycle?</h5>
    <HelpPopup text={helpText}>
      <h3>What is the MPA lifecycle?</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Gravida laoreet leo scelerisque aliquet mattis malesuada turpis volutpat. Ultrices lectus suspendisse sed pharetra. Proin elementum lacus volutpat felis, nulla convallis aenean faucibus. Ante nisi, volutpat pretium diam porta eget. Egestas tempor, risus tortor malesuada. Mus et cras risus dictum. Quisque sollicitudin nisi, feugiat aenean.
      </p>
      <a href="/">More about this framework</a>
    </HelpPopup>
  </div>
  <div class="circle-menu-section">
      <div class="circle-menu">
          {#if currentTagHovered != -1}
            <div class="info-text" bind:this={infoTextElement}>
              {@html LIFECYCLE_TEXT[currentTagHovered]}
            </div>
          {/if}
          <CircleMenu data={menuData} bind:currentSegmentHovered={currentTagHovered}/>
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
          <TagContainer tags={renderTags.STAGE} bind:currentTagHovered={currentTagHovered}/>
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
        <TagContainer tags={renderTags.USER}/>
      {/if}
    </div>
  </div>

</div>

<style lang="scss">

  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .lifecycle {
    background: #66CFD6;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    padding: 20px;
  }
  .title {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: #000000;
    margin: 15px 0 10px;
    .top-section &:first-child {
      margin: 0;
    }
  }

  .circle-menu-section {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    column-gap: 10px;

    .tag-container {
      flex: 1 1 70%;
    }

    .circle-menu {
      flex: 0.8 0.2 120px;
      position: relative;
      z-index: 1;

      :global(svg) {
        width: 100%;
      }

      .info-text{
        width: 130px;
        height: 130px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        animation: fadeIn ease-in-out 0.5s;
        -webkit-animation: fadeIn ease-in-out 0.5s;
        -moz-animation: fadeIn ease-in-out 0.5s;
        z-index: -1;
      }
    }
  }
  @media (max-width: 900px) {
    .title {
      width: auto;
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

  @keyframes fadeIn {
    0% {
      opacity:0;
    }
    100% {
      opacity:1;
    }
  }
</style>