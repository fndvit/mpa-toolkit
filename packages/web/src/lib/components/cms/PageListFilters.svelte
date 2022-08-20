<script lang="ts">
  import type { Tag } from '@mpa/db';
  import { groupBy } from '$lib/utils';
  import { TagFilter, Searchbar } from '$lib/components';

  export let tags: Tag[];
  export let activeTags: Tag[] = [];
  export let pageSearch: string;

  $: activeTags = [...activeStageTags, ...activeTopicTags, ...activeUsersTags];

  let activeStageTags: Tag[] = [];
  let activeTopicTags: Tag[] = [];
  let activeUsersTags: Tag[] = [];

  let tagSearch = '';
  let groupedOptions = groupBy(tags, tag => tag.type);

  $: searchRegex = new RegExp(tagSearch, 'i');

  $: filteredTagsStage = groupedOptions.STAGE.filter(p => searchRegex.test(p.value));
  $: filteredTagsTopic = groupedOptions.TOPIC.filter(p => searchRegex.test(p.value));
  $: filteredTagsUser = groupedOptions.USER.filter(p => searchRegex.test(p.value));
</script>

<div class="searchbar">
  <Searchbar bind:search={pageSearch} type="top" placeholder={'Search a Page Title...'} submit={null} />
</div>

<div class="filters">
  <div class="tags">
    <div class="title">
      <h1>Tags</h1>
      <div class="material-icons">search</div>
      <input type="text" bind:value={tagSearch} />
    </div>

    <div>
      <p>MPA lifecycle</p>
      <TagFilter tags={filteredTagsStage} bind:activeTags={activeStageTags} />
    </div>
    <div class="type-topic">
      <p>What's this about</p>
      <TagFilter tags={filteredTagsTopic} bind:activeTags={activeTopicTags} />
    </div>
    <div class="type-user">
      <p>Good for</p>
      <TagFilter tags={filteredTagsUser} bind:activeTags={activeUsersTags} />
    </div>
  </div>
</div>

<style lang="stylus">

  .searchbar {
    max-width: 530px;
    margin-top: 100px;

    :global(.searchbar){
      :global(.placeholder){
        color: $colors.neutral-black;
      }
      :global(.input-text){
        color: $colors.neutral-black;
      }
    }
  }

  .filters {
    box-sizing: border-box;
    box-shadow: inset 0px 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding: 0px 0px 15px 25px;
    margin-top: 26px;

    .type-topic {
      :global(.tag-filter .tag.secondary) {
        background: alpha($colors.lifecycle-bg, 0.4);
      }
      :global(.tag-filter .tag) {
        background: $colors.lifecycle-bg;
      }
    }

    .type-user {
      :global(.tag-filter .tag.secondary) {
        background: alpha($colors.tag-bg-cards, 0.4);
      }
      :global(.tag-filter .tag) {
        background: $colors.tag-bg-cards;
      }
    }

    h1 {
      typography: h5;
      margin: 36px 10px;
    }
    p {
      font-size: 12px;
      font-weight: 700;
      margin: 10px;
    }

    .title {
      display: flex;
      align-items: center;

      input {
        height: 25px;
        border: none;
        text-decoration: none;
        border-bottom: 1px solid;

        &:focus {
          outline: none;
        }
      }

      .material-icons {
        font-size: 20px;
        margin-left: 20px;
      }
    }
  }
</style>
