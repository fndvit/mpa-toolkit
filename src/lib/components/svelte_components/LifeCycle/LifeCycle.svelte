<script context='module' lang='ts'>
  export enum TagEnum {
    Wherein = 1, Whatsabout = 2, Goodfor = 3
  }

  export interface LifeCycleTags {
    wherein: Option[],
    whatsabout: Option[],
    goodfor: Option[]
  }
</script>
<script lang='ts'>
  import CircleMenu from '../CircleMenu/CircleMenu.svelte';
  import menuConfigFile from '../CircleMenu/circlemenuconfig.json';
  import menuDataFile from '../CircleMenu/testingData.json';
  import type {CircleMenuConfig, MenuElement} from '../CircleMenu/CircleMenu.svelte';
  import MultiSelect, { Option } from 'svelte-multiselect';


  export let circleMenuConfig: CircleMenuConfig = menuConfigFile;
  export let menuData: MenuElement[] = menuDataFile;
  export let tagsOptions: Option[] = [];
  export let tags: Option[];
  export let editable: boolean = false;
  export let currentIndex: number = 0;

  let currentGroup = menuData[currentIndex].group;

  $: {
    currentGroup = menuData[currentIndex].group;
  }

  let whereinTags = tagsOptions.filter(t => t[t.value] === TagEnum.Wherein);
  let whatsaboutTags = tagsOptions.filter(t => t[t.value] === TagEnum.Whatsabout);
  let goodforTags = tagsOptions.filter(t => t[t.value] === TagEnum.Goodfor);

  let whereinSeletedOptions: {primary: Option[], secondary: Option[]} = {primary: [], secondary: tags.filter(t => t.typeId === TagEnum.Wherein)};
  let whatsaboutSelectedOptions: Option[] = tags.filter(t => t.typeId === TagEnum.Whatsabout);
  let goodforSelectedOptions: Option[] = tags.filter(t => t.typeId === TagEnum.Goodfor);

  const maxWhereinOptions = 7;
  const maxWhereinPrimarySelectedOption = 2;

  $: {
    tags = whereinSeletedOptions.primary.concat(whereinSeletedOptions.secondary.concat(whatsaboutSelectedOptions.concat(goodforSelectedOptions)));
  }
</script>
<div class='container'>
  <h5 class='title'>Where in the MPA lifecycle?</h5>
  <div class="circleMenuSection">
      <div class="circleMenu">
          <CircleMenu
              config={circleMenuConfig}
              data={menuData}
              bind:currentPageIndex={currentIndex}
          ></CircleMenu>
      </div>
      <div class="tagContainer">
        {#if editable}
        <div class="subtitle">Primary Tags</div>
        <MultiSelect bind:selected={whereinSeletedOptions.primary} options={whereinTags} disabled={false} maxSelect={maxWhereinPrimarySelectedOption}/>
        <div class="subtitle">Secondary Tags</div>
        <MultiSelect bind:selected={whereinSeletedOptions.secondary} options={whereinTags.filter((st) => !whereinSeletedOptions.primary.find((pt) => pt.label === st.label))} disabled={false} maxSelect={maxWhereinOptions}/>
        {/if}
      </div>
  </div>
  <h5 class='title'>What&apos;s this about</h5>
  <div class="tagContainer">
    {#if editable}
    <MultiSelect bind:selected={whatsaboutSelectedOptions} options={whatsaboutTags} disabled={false} />


    {/if}
  </div>
  <h5 class='title'>Good for ...</h5>
  <div class="tagContainer">
    {#if editable}
    <MultiSelect bind:selected={goodforSelectedOptions} options={goodforTags} disabled={false} />

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