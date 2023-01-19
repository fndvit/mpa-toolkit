<script lang="ts">
  import type { Tag } from '@mpa/db';
  import { groupBy } from '@mpa/utils';
  import TagFilter from './TagFilter.svelte';
  import { Searchbar } from '$lib/components/generic';
  import { createEventDispatcher } from 'svelte';

  export let tags: Tag[];
  export let activeTags: Tag[] = [];

  let searchText: string;
  let activeSearch: string;

  const dispatch = createEventDispatcher<{ search: string }>();

  let activeStageTags: Tag[] = [];
  let activeTopicTags: Tag[] = [];
  let activeUsersTags: Tag[] = [];

  let groupedOptions = groupBy(tags, tag => tag.type);

  $: activeTags = [...activeStageTags, ...activeTopicTags, ...activeUsersTags];

  $: dispatch('search', activeSearch);
</script>

<div class="filters">
  <div class="tags">
    <div>
      <p>Search</p>
      <form
        class="searchbar"
        on:submit={e => {
          e.preventDefault();
          activeSearch = searchText;
        }}
      >
        <input bind:value={searchText} placeholder={'Search...'} />
        {#if activeSearch}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <svg
            width="15px"
            viewBox="0 0 20 20"
            fill="currentColor"
            on:click={() => {
              searchText = '';
              activeSearch = searchText;
            }}
            ><path
              d="M10 1.6a8.4 8.4 0 100 16.8 8.4 8.4 0 000-16.8zm4.789 11.461L13.06 14.79 10 11.729l-3.061 3.06L5.21 13.06 8.272 10 5.211 6.939 6.94 5.211 10 8.271l3.061-3.061 1.729 1.729L11.728 10l3.061 3.061z"
            /></svg
          >
        {/if}
      </form>
    </div>

    <div class="tags__stage">
      <p>MPA lifecycle</p>
      <TagFilter tags={groupedOptions.STAGE} bind:activeTags={activeStageTags} />
    </div>
    <div class="tags__topic">
      <p>What's this about</p>
      <TagFilter tags={groupedOptions.TOPIC} bind:activeTags={activeTopicTags} />
    </div>
    <div class="tags__user">
      <p>Good for</p>
      <TagFilter tags={groupedOptions.USER} bind:activeTags={activeUsersTags} />
    </div>
  </div>
</div>

<style lang="postcss">
  .searchbar {
    position: relative;
    max-width: 530px;

    > input {
      width: 100%;
      border-radius: 0;
      border: 1px solid lightgray;
      box-shadow: inset 0 2px 8px rgb(0 0 0 / 2.5%);
      padding: 5px;

      &:focus {
        outline: 1px solid rgba(0 0 0 / 50%);
      }
    }

    > svg {
      position: absolute;
      right: 0;
      cursor: pointer;
      padding: 8px;
    }
  }

  .tags {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 15px;

    > div {
      display: contents;

      > * {
        display: flex;
        align-items: center;
      }
    }

    .tags__topic {
      :global(.tag-multiselect__option--selected) {
        background: color($c-lifecycle-bg alpha(0.7));
      }
    }

    .tags__user {
      :global(.tag-multiselect__option--selected) {
        background: color($c-tag-bg-cards);
      }
    }
  }

  .filters {
    box-sizing: border-box;
    box-shadow: inset 0 2px 8px rgb(0 0 0 / 10%);
    border-radius: 20px;
    padding: 15px 0 15px 25px;
    margin-top: 70px;

    p {
      font-size: 12px;
      font-weight: 700;
      margin: 10px;
    }
  }
</style>
