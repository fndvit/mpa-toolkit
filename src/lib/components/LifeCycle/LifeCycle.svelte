<script context='module' lang='ts'>
  export interface LifeCycleTags {
    wherein: {
      primary: Option[];
      secondary: Option[];
    }
    whatsabout: Option[];
    goodfor: Option[];
  }
</script>
<script lang='ts'>
  import { TagCategory, TagType } from "@prisma/client";
  import CircleMenu from '../CircleMenu/CircleMenu.svelte';
  import menuConfigFile from '../CircleMenu/circlemenuconfig.json';
  import menuDataFile from '../CircleMenu/lifeCycleConfig.json';
  import type {CircleMenuConfig, MenuElement} from '../CircleMenu/CircleMenu.svelte';
  import MultiSelect, { Option } from 'svelte-multiselect';
  import type { Tag } from '$lib/types';
  import TagContainer from  '../Tags/TagContainer.svelte';
  import type { TagParameters } from '../Tags/TagContainer.svelte';


  export let circleMenuConfig: CircleMenuConfig = menuConfigFile;
  export let menuData: MenuElement[]= menuDataFile;
  export let tagsOptions: LifeCycleTags = <LifeCycleTags>{};
  export let tagsSelected: LifeCycleTags = <LifeCycleTags>{};
  export let tags: (Tag & { category: string})[] = [];
  export let editable: boolean = false;

  let whereinTags: TagParameters[] = [];
  let goodforTags: TagParameters[] = [];
  let whatsaboutTags: TagParameters[] = [];

  const parseTags = (tagType : TagType) : TagParameters[] => {
      let tempTags: (Tag & {category: string})[]
      tempTags = tags.filter(t => t.type === tagType);

      return tempTags.map(t => ({
        tag: t.value,
        alt: (t.category === TagCategory['SECONDARY'] ? 'fading' : 'default'),
      }))
  };

  if(!editable){
    whereinTags = parseTags(TagType['WHEREIN']);
    goodforTags= parseTags(TagType['GOODFOR']);
    whatsaboutTags = parseTags(TagType['WHATSABOUT']);
  }

  const maxWhereinOptions = 7;
  const maxWhereinPrimarySelectedOption = 2;

  $: {
    if(editable){
      tags = getTagsFromMultiSelect(tagsSelected.goodfor ? tagsSelected.goodfor : [], TagType['GOODFOR'], TagCategory['PRIMARY']);
      tags = tags.concat(getTagsFromMultiSelect(tagsSelected.whatsabout ? tagsSelected.whatsabout : [], TagType['WHATSABOUT'], TagCategory['PRIMARY']));
      tags = tags.concat(getTagsFromMultiSelect(tagsSelected.wherein ? tagsSelected.wherein.primary : [], TagType['WHEREIN'], TagCategory['PRIMARY']));
      tags = tags.concat(getTagsFromMultiSelect(tagsSelected.wherein ? tagsSelected.wherein.secondary : [], TagType['WHEREIN'], TagCategory['SECONDARY']));
      menuData =  generateCircleMenuData();
    }
  }

  const generateCircleMenuData = () => {
    return menuData.map((option, i) => {
      const tag = tags.find(t => parseInt(t.id) === option.id);
      const type = tag ? tag.category : '0';

      return {
        id: option.id,
        percentatge: option.percentatge,
        group: option.group,
        type:  type === TagCategory['PRIMARY'] ? 'main' : type === TagCategory['SECONDARY'] ? 'secondary' : 'unselected',
        color: type === TagCategory['PRIMARY'] ? "#fbe26b" : "#fbe26b80"
      }
    })
  }

  const getTagsFromMultiSelect = (tags: Option[], type: TagType, category: TagCategory) => tags.map(t => ({
      id: t.value + '',
      value: t.label + '',
      type: type,
      category: category,
    }))

  menuData =  generateCircleMenuData();
</script>
<div class='container'>
  <h5 class='title'>Where in the MPA lifecycle?</h5>
  <div class="circleMenuSection">
      <div class="circleMenu">
          <CircleMenu
              config={circleMenuConfig}
              data={menuData}
          ></CircleMenu>
      </div>
      <div class="tagContainer">
        {#if editable}
        <div class="subtitle">Primary Tags</div>
        <MultiSelect bind:selected={tagsSelected.wherein.primary} options={tagsOptions.wherein.primary.filter((pt) => !tagsSelected.wherein.secondary.find((st) => st.label === pt.label))} disabled={false} maxSelect={maxWhereinPrimarySelectedOption}/>
        <div class="subtitle">Secondary Tags</div>
        <MultiSelect bind:selected={tagsSelected.wherein.secondary} options={tagsOptions.wherein.secondary.filter((st) => !tagsSelected.wherein.primary.find((pt) => pt.label === st.label))} disabled={false} maxSelect={maxWhereinOptions}/>
        {:else}
        <TagContainer tags={whereinTags} />
        {/if}
      </div>
  </div>
  <h5 class='title'>What&apos;s this about</h5>
  <div class="tagContainer">
    {#if editable}
    <MultiSelect bind:selected={tagsSelected.whatsabout} options={tagsOptions.whatsabout} disabled={false} />
    {:else}
    <TagContainer tags={whatsaboutTags} />
    {/if}
  </div>
  <h5 class='title'>Good for ...</h5>
  <div class="tagContainer">
    {#if editable}
    <MultiSelect bind:selected={tagsSelected.goodfor} options={tagsOptions.goodfor} disabled={false} />
    {:else}
    <TagContainer tags={goodforTags} />
    {/if}
  </div>

</div>

<style>
  .container{
      width: 294px;
      height: auto;
      background: #66CFD6;
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
      border-radius: 20px;
      padding-bottom: 20px;
  }
  .circleMenu{
      margin: 0 auto !important;
      width: fit-content;
  }
  .title{
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
  .tagContainer{
      margin-left: 20px;
      margin-right: 20px;
  }
  @media (max-width: 900px) {
      .container{
          width: 372px;
          height: 372px;
      }
      .title{
          width: auto;
          font-size: 10px;
      }
      .circleMenu{
          margin: 0 !important;
          width: fit-content;
      }
      .circleMenuSection{
          display: grid;
          grid-template-columns: auto auto;
      }
      .circleMenuSection .tagContainer{
          text-align: center;
      }
  }
</style>