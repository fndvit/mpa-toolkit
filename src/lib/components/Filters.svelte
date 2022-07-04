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

</script>

<div class="filters">
  <div class="tags">
    <h1>Tags</h1>
    <div>
      <p>MPA lifecycle</p>
      <TagFilter tags={tags.STAGE} bind:activeTags={activeStageTags} />
    </div>
    <div class="type-topic">
      <p>What's this about</p>
      <TagFilter tags={tags.TOPIC} bind:activeTags={activeTopicTags}/>
    </div>
    <div class="type-user">
      <p>Good for</p>
      <TagFilter tags={tags.USER} bind:activeTags={activeUsersTags}/>
    </div>
  </div>

  <div class="order">
    <h1>Order by</h1>
    <div class="orderby-grid">
      {#each options as opt, index}
        <input type="checkbox" bind:checked={orderby[index]}>
        <label for="authors">{opt}</label>
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
  }

  .orderby-grid {
    margin: 20px 5px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 20px;
    width: 750px;
  }

</style>
