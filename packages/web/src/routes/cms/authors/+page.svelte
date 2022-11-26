<script lang="ts">
  import type { Author } from '@mpa/db';
  import { openModal } from 'svelte-modals';
  import type { PageData } from './$types';
  import * as api from '$lib/api';
  import { DeleteModal, Searchbar } from '$lib/components/generic';
  import { toaster } from '$lib/components/generic/Toaster';
  import AuthorEditor from '$lib/components/cms/AuthorEditor.svelte';

  export let data: PageData;
  let { authors } = data;

  let authorSearch = '';
  let newAuthor: Author.ForCMS;

  const sortAuthors = (_authors: typeof authors) =>
    [..._authors].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'accent' }));

  authors = sortAuthors(authors);

  const handleDelete = async (author: Author.ForCMS) => {
    toaster.report(
      async () => {
        await api.author.delete(author.id);
        authors = authors.filter(row => row != author);
      },
      'Author deleted',
      'Error deleting author'
    );
  };

  const onClickAdd = () => (newAuthor = { id: null, name: null, bio: null, img: null, chapter: [] });

  const onClickSaveAuthor = async () => {
    toaster.report(
      async () => {
        const _author = await api.author.create({ name: newAuthor.name, bio: newAuthor.bio });
        newAuthor.id = _author.id;
        authors.push({ ...newAuthor });
        authors = sortAuthors(authors);
        newAuthor = undefined;
      },
      'Author saved',
      'Error saving author'
    );
  };

  async function onClickDeleteAuthor(author: Author.ForCMS) {
    if (author.chapter.length === 0) {
      await handleDelete(author);
    } else {
      openModal(DeleteModal, {
        title: 'Delete Author',
        message: 'This author is on some pages. Are you sure you want to delete it?',
        confirmText: author.name,
        onYes: () => handleDelete(author)
      });
    }
  }

  $: searchRegex = new RegExp(authorSearch, 'i');
  $: filteredAuthors = authors.filter(author => searchRegex.test(author.name));
</script>

<div class="container">
  <div class="title">
    <a href="/cms"><span class="material-icons arrow">navigate_before</span></a>
    <h1>Authors</h1>
  </div>

  <div class="tool-bar">
    <div class="searchbar">
      <Searchbar bind:search={authorSearch} type="inline" placeholder={'Search an Author...'} submit={null} />
    </div>

    <button class="add-author" on:click={onClickAdd}>
      <span class="material-icons face">face</span>New author
    </button>
  </div>

  {#if filteredAuthors.length === 0 && !newAuthor}
    <div class="no-authors">No authors</div>
  {:else}
    <ul class="authors">
      {#if newAuthor}
        <li>
          <AuthorEditor bind:author={newAuthor} />
          <button on:click|once={onClickSaveAuthor} class="icon-author">
            <div class="material-icons">done</div>
          </button>
        </li>
      {/if}
      {#each filteredAuthors as author (author.id)}
        <li>
          <AuthorEditor bind:author />
          <button on:click|once={() => onClickDeleteAuthor(author)} class="icon-author">
            <div class="material-icons">delete</div>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="postcss">
  .container {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem 6rem;
  }

  .tool-bar {
    margin: 60px 0;
    display: flex;
    flex-wrap: wrap;
    row-gap: 10px;
    justify-content: space-between;
  }

  .searchbar {
    :global(.searchbar) {
      width: 530px;

      :global(.placeholder) {
        color: $c-neutral-black;
      }

      :global(.input-text) {
        color: $c-neutral-black;
      }
    }
  }

  .add-author {
    display: flex;
    align-items: center;
    width: 252px;
    padding: 5px 20px;
    cursor: pointer;
    font: $f-h5-light;
    text-transform: uppercase;
    background: white;
    border: none;
    border-radius: 10px;
    box-shadow: 0 1px 16px rgb(0 0 0 / 10%);
    box-sizing: border-box;

    &:hover {
      background: $c-neutral-light;
      text-decoration: none;
    }

    .face {
      padding: 10px;
    }
  }

  .no-authors {
    font: $f-ui;
  }

  .authors {
    padding: 0;

    > * {
      display: flex;
      border-bottom: solid 3px #f5f5f5;
    }

    .icon-author {
      border: none;
      background: none;
      margin-left: auto;
      margin-right: 0;
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
      }
    }
  }

  h1 {
    @mixin font-responsive h2;
  }

  .title {
    display: flex;
    align-items: center;
    column-gap: 30px;

    .arrow {
      color: black;
      font-size: 32px;
    }
  }
</style>
