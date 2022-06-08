<script lang="ts">
  import type { SubTypes, UserInfo } from "$lib/types";
  import AuthorsEditor from "$lib/components/cms/AuthorsEditor.svelte";
  import KeyTakeaways from "$lib/components/cms/KeyTakeaways.svelte";
  import UserImage from "$lib/components/UserImage.svelte";
  import EditableText from "../generic/EditableText.svelte";
  import LifeCycle from "../LifeCycle.svelte";

  export let chapter: SubTypes.Chapter.PageHead;
  export let tags = [];
  export let allAuthors: UserInfo[] = [];
  export let editable = false;
  export let readTime: number = undefined;

  if (!chapter) {
    chapter = {
      authors: [],
      keyTakeaways: [],
      summary: ''
    };
  }

  const emptyAuthors = [{ id: 0, name: 'Author', img: '' }];

  function onClickAuthor(i: number) {
    chapter.authors = [...chapter.authors];
    chapter.authors.splice(i, 1);
  }

  $: displayAuthors = editable && !chapter.authors.length ? emptyAuthors : chapter.authors;

</script>

<div class="meta" class:meta-editable={editable}>

  <div class="first-line">

    <div class="author-images">
      {#each displayAuthors as user}
        <UserImage {user} />
      {/each}
    </div>

    {#if editable}

      <div class="author-editor">
        <AuthorsEditor {allAuthors} bind:authors={chapter.authors} />
      </div>
    {:else}
      <div class="author-names">
        {#each displayAuthors as author, i}
          {#if i > 0 && i === displayAuthors.length - 1}
            and
          {/if}
          <div on:click={() => editable && onClickAuthor(i)}>{author.name}</div>
        {/each}
      </div>
    {/if}

    {#if readTime !== undefined}
      <div class="readtime">{readTime} min read</div>
    {/if}

  </div>

  <div class="summary">
    <EditableText bind:value={chapter.summary} {editable} placeholder='Summary text...' />
  </div>

  <div class="grid-container">
    <div class="grid-item-keytakeaways">
      <KeyTakeaways bind:keyTakeaways={chapter.keyTakeaways} {editable}/>
    </div>
    <div class="grid-item-lifecycle">
      <LifeCycle tags={tags}/>
    </div>
  </div>

</div>

<style lang="scss">
  .grid-container {
    display: grid;
    grid-template-columns: minmax(47rem, 69rem) minmax(250px, auto);
    grid-template-rows: 1px auto;
    grid-gap: 35px;
    grid-template-areas:
    "keytakeaways lifecycle"
    "keytakeaways none";
    .grid-item-keytakeaways {
      grid-area: keytakeaways;
    }
    .grid-item-lifecycle {
      grid-area: lifecycle;

      :global(.lifecycle) {
        margin: auto;
        max-width: 300px;
      }
    }
  }
  .meta {
    --ui-color-placeholder: #ffffff55;
    background: #096EAE;
    color: #F9F9F9;
    padding: 2rem var(--page-padding) 3rem;
  }

  .first-line {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    column-gap: 10px;
  }

  .author-images {
    height: 66px;
    margin-right: 15px;
    display: flex;
    column-gap: 10px;
  }

  .author-names {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    column-gap: 5px;
  }

  .summary {
    font-family: var(--font-serif);
    font-size: 28px;
    line-height: 42px;
    max-width: 800px;
    margin-bottom: 40px;
  }

  .author-editor {
    :global(.options) {
      color: #333;
    }
  }
  @media screen and (max-width: 1250px){
    .grid-container{
      grid-template-columns: auto;
      grid-template-rows: auto 180px;
      grid-template-areas:
      "keytakeaways"
      "lifecycle";
    }
    :global(.page-content .body-column  .content-section){
      margin-top: 200px !important;
    }

    .grid-item-lifecycle{


      :global(.lifecycle) {
        max-width: 500px !important;
      }
    }
  }
  @media screen and (max-width: 768px) {

    .author-images {
      max-width: 100%;
    }

    .first-line {
      display: block;
    }

    .author-names {
      margin-top: 20px;
    }

    .summary {
      font-size: 1.125rem;
      line-height: 32px;
      margin-bottom: 1.125rem;
    }

  }


</style>