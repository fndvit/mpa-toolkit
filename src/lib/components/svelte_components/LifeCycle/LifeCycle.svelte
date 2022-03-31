<script context="module" lang="ts">
  interface TagParametersGroup extends TagParameters {
    group: number;
  }
  export interface LifeCycleTags{
    wherein: TagParametersGroup[];
    whatsabout: TagParameters[];
    goodfor: TagParameters[];
  }
</script>
<script lang='ts'>
  import TagContainer from '../Tags/TagContainer.svelte';
  import CircleMenu from '../CircleMenu/CircleMenu.svelte';
  import menuConfigFile from '../CircleMenu/circlemenuconfig.json';
  import menuDataFile from '../CircleMenu/testingData.json';
  import tagsDataFile from './lifeCycleData.json';
  import type {CircleMenuConfig, MenuElement} from '../CircleMenu/CircleMenu.svelte';
  import type { TagParameters } from '../Tags/Tag.svelte';

  export let circleMenuConfig: CircleMenuConfig = menuConfigFile;
  export let menuData: MenuElement[] = menuDataFile;
  export let tagsData: LifeCycleTags = tagsDataFile;

  export let currentIndex: number = 0;

  let currentGroup = menuData[currentIndex].group;

  $: {
    currentGroup = menuData[currentIndex].group;
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
      <div class="tagContainer"><TagContainer tags={tagsData.wherein.filter((t) => t.group === currentGroup)} width={285}/></div>
  </div>
  <h5 class='title'>What&apos;s this about</h5>
  <div class="tagContainer"><TagContainer tags={tagsData.whatsabout} width={285}/></div>
  <h5 class='title'>Good for ...</h5>
  <div class="tagContainer"><TagContainer tags={tagsData.goodfor} width={285}/></div>

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