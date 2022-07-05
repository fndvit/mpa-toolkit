<script lang="ts">
  import TagFilter from '$lib/components/cms/TagFilter.svelte';
  import type { SubTypes } from '$lib/types';
  
  export let tags;
 
  export let activeTags: SubTypes.Tag[] = [];
  export let orderby;

  let options = ["Authors", "Chapter", "CaseStudy"];

  $: orderby = options.map(() => false);
  $: activeTags = [...activeStageTags, ...activeTopicTags, ...activeUsersTags ];

  let activeStageTags: SubTypes.Tag[] = [];
  let activeTopicTags: SubTypes.Tag[] = [];
  let activeUsersTags: SubTypes.Tag[] = [];

  let tagSearch = '';

  $: searchRegex = new RegExp(tagSearch, 'i');
  
  $: filteredTagsStage = tags.STAGE.filter(p => searchRegex.test(p.value));
  $: filteredTagsTopic = tags.TOPIC.filter(p => searchRegex.test(p.value));
  $: filteredTagsUser = tags.USER.filter(p => searchRegex.test(p.value));

</script>

<div class="filters">
  <div class="tags">
    <div class="title">
      <h1>Tags</h1>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M 15.5 15.5 L 19 19" stroke-linecap="round" stroke-width="1.5" stroke-linejoin="round" stroke="#606060"/>
        <path d="M 5 11 C 5 14.3137 7.68629 17 11 17 C 12.6597 17 14.1621 16.3261 15.2483 15.237 C 16.3308 14.1517 17 12.654 17 11 C 17 7.68629 14.3137 5 11 5 C 7.68629 5 5 7.68629 5 11 Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke="#606060"/>
      </svg>
      <input type="text" bind:value={tagSearch}>
    </div>
    
    <div>
      <p>MPA lifecycle</p>
      <TagFilter tags={filteredTagsStage} bind:activeTags={activeStageTags} />
    </div>
    <div class="type-topic">
      <p>What's this about</p>
      <TagFilter tags={filteredTagsTopic} bind:activeTags={activeTopicTags}/>
    </div>
    <div class="type-user">
      <p>Good for</p>
      <TagFilter tags={filteredTagsUser} bind:activeTags={activeUsersTags}/>
    </div>
  </div>

  <div class="order">
    <h1>Order by</h1>
    <div class="orderby-grid">
      {#each options as opt, index}
        {#if ((orderby[0] === true || orderby[1] === true) && index == 2) ||  (orderby[2] === true && index != 2)}
          <input type="checkbox" bind:checked={orderby[index]} id={opt} disabled>
          <label for="authors">{opt}</label>
        {:else}
          <input type="checkbox" bind:checked={orderby[index]} id={opt} >
          <label for="authors">{opt}</label>
        {/if}
      {/each}
      
    </div>
  </div>
</div>

<style lang="stylus">
  
  .filters {
      width: 100%;
      height: auto;
      box-sizing: border-box;
      box-shadow: inset 0px 2px 8px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      padding: 5px 25px;
      margin-top: 26px;

      .type-topic {
        :global(.tag-filter .tag.secondary) {
          background: alpha(#66CFD6, 0.4);
        }
        :global(.tag-filter .tag) {
          background: #66CFD6;
        }
       
      }

      .type-user {
        :global(.tag-filter .tag.secondary) {
          background: alpha(#DADCE0, 0.4);
        }
        :global(.tag-filter .tag) {
          background: #DADCE0;
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

          &:focus {
            outline: none;
            border-bottom: 1px solid;
          }
        }

        svg {
          fill: none;
          margin-left: 20px;
        }
      }
  }

  .orderby-grid {
    margin: 20px 5px;
    display: grid;
    grid-template-columns: auto 1fr auto 1fr auto 1fr;
    grid-gap: 20px;
    width: 750px;
  }
</style>
