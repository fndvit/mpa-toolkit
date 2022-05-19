<script lang="ts">
  import LifeCycle from '$lib/components/LifeCycle/LifeCycle.svelte';
  import { openModal } from 'svelte-modals'
  import { goto } from "$app/navigation";
  import Editor from "$lib/Editor/Editor.svelte";
  import Spinner from "$lib/components/Spinner.svelte";
  import type { CompletePage, PageRequest, PageTag, Tag, UserInfo } from '$lib/types';
  import DeleteModal from "$lib/components/DeleteModal.svelte";
  import { createPage, deletePage, updatePage, uploadImage } from '$lib/api';
  import LoadingButton from '$lib/components/LoadingButton.svelte';
  import Button from '$lib/components/Button.svelte';
  import TimedMessage from '$lib/components/TimedMessage.svelte';
  import CaseStudyMeta from '$lib/components/content/CaseStudyMeta.svelte';
  import cloneDeep from 'clone-deep'
  import { compareDeep, slugify, Unpacked } from '$lib/helpers/utils';
  import ChapterMeta from '$lib/components/content/ChapterMeta.svelte';
  import MenuButton from '$lib/Editor/MenuButton.svelte';
  import Splash from '$lib/components/content/Splash.svelte';
  import IconButton from '$lib/components/IconButton.svelte';

  export let users: UserInfo[];
  export let allTags: Tag[];
  export let page: CompletePage;

  const pageId = page.id;

  const isNewPage = !page.id;

  let pageType: "Case Study" | "Chapter" = page.caseStudy ? "Case Study" : "Chapter";

  const pageTagToRequestTag = (t: PageTag): Unpacked<PageRequest['tags']> => ({id: t.tag.id, category: t.category});
  const chapterToRequest = ({pageId, authors, ...c}: CompletePage['chapter']): PageRequest['chapter'] => ({
    ...c, authors: authors.map(a => a.id),
  });

  const convertPageToPageRequest = (p: CompletePage): PageRequest => {
    const { id, editedAt, createdAt, ..._p} = cloneDeep(p);
    const { pageId: _, ...caseStudy } = _p.caseStudy || {} as typeof p.caseStudy;
    return {
      ..._p,
      tags: _p.tags?.map(pageTagToRequestTag) || [],
      chapter: _p.chapter ? chapterToRequest(_p.chapter) : undefined,
      caseStudy: _p.caseStudy ? caseStudy : undefined
    };
  }

  const _page = convertPageToPageRequest(page);

  let chapter = cloneDeep(page.chapter);
  let tags: PageTag[] = page.tags || [];

  let savedPage = cloneDeep(_page);
  let uploadingImage = false;
  let saving = false;
  let deleting = false;
  let autoPopulateSlug = !_page.slug;
  let imageInput: HTMLInputElement;

  let showSaveStatusText: TimedMessage['$$prop_def']['showMessage'];

  async function onClickSave() {
    saving = true;

    if (isNewPage) {
      const {id} = await createPage(_page);
      window.location.href = `/cms/pages/${id}`;
    } else {
      await updatePage(pageId, _page);
    }
    saving = false;
    showSaveStatusText('Saved...')
    savedPage = cloneDeep(_page);
  }

  async function onDeleteModalYes() {
    deleting = true;
    await deletePage(pageId);
    goto('/cms/pages');
  }

  async function onClickDelete() {
    openModal(DeleteModal, { onYes: onDeleteModalYes })
  }

  const onImageChange: svelte.JSX.EventHandler<FormDataEvent, HTMLInputElement> = async (e) => {
    if (e.currentTarget.files.length) {
      uploadingImage = true;
      _page.img = await uploadImage(e.currentTarget.files[0]);
      uploadingImage = false;
    }
  };

  const onChangeSlug: svelte.JSX.ChangeEventHandler<HTMLInputElement> = e => {
    autoPopulateSlug = e.currentTarget.value.length === 0;
  };

  const onBeforeInputSlug: svelte.JSX.EventHandler<InputEvent, HTMLInputElement> = e => {
    const validChars = /[a-zA-Z0-9-]/;
    if (!validChars.exec(e.data)) e.preventDefault();
  }

  $: _page.tags = tags.map(pageTagToRequestTag);

  $: dirty = !compareDeep(_page, savedPage);

  $: dirty && showSaveStatusText && showSaveStatusText(null);

  $: if (autoPopulateSlug) {
    _page.slug = slugify(_page.title);
  }

  $: sharedFieldsComplete = _page.title && _page.slug;

  $: disabled = saving || deleting;

  $: saveable = dirty && !saving && !deleting && sharedFieldsComplete;

  $: _page.chapter = chapter ? chapterToRequest(chapter) : undefined;

</script>

<div class="meta">

  <div class="top-controls">
    <input class="image-input" bind:this={imageInput} type="file" on:change={onImageChange} accept=".jpg, .jpeg" {disabled} >

    <input class="slug" type="text" id="slug" bind:value={_page.slug} {disabled}
      on:beforeinput={onBeforeInputSlug}
      on:change={onChangeSlug}
    />

    <IconButton icon="image" {disabled} on:click={() => imageInput.click()} />
    <div class="spinner" class:hidden={!uploadingImage}>
      <Spinner />
    </div>

  </div>

  <Splash bind:title={_page.title} img={_page.img} editable />
  {#if pageType === "Case Study"}
    <CaseStudyMeta bind:caseStudy={_page.caseStudy} editable />
  {:else}
    <ChapterMeta bind:chapter allAuthors={users} editable />
  {/if}

</div>

<div class="editor-container">

  <div class="life-cycle">
    <LifeCycle {allTags} bind:tags editable/>
  </div>

  <Editor bind:content={_page.content}>
    <div slot="menu-extra" class="page-controls">
      {#if saving}Saving...{/if}
      <TimedMessage bind:showMessage={showSaveStatusText} />
      <a href="/{savedPage.slug}" rel="external">Preview</a>
      <MenuButton active={!_page.draft} on:click={() => _page.draft = !_page.draft} icon="public" title="Public" />
      <div class="save-button">
        <LoadingButton on:click={onClickSave} loading={saving} disabled={!saveable}>
          {dirty ? 'Save' : 'Saved'}
        </LoadingButton>
      </div>
      {#if !isNewPage}
        <div class="delete-button">
          <Button on:click={onClickDelete}>Delete</Button>
        </div>
      {/if}
    </div>
  </Editor>
</div>

<style lang="scss">

  .top-controls {
    position: absolute;
    left: 0;
    right: 0;
    width: fit-content;
    margin: auto;
    padding-top: 40px;
    display: flex;
    column-gap: 10px;
    align-items: center;
    :global(.icon-button) {
      --bg-color: #ffffff99;
      --hover-border-color: transparent;
      --hover-bg: #dddddd99;
      --size: 2rem;
      --font-size: 1rem;
    }

    .spinner {
      display: flex;
      align-items: center;
      &.hidden {
        visibility: hidden;
      }
    }
  }

  .slug {
    text-transform: lowercase;
    width: 400px;
    background: #ffffff99;
    border: 1px solid #00000055;
    border-radius: 2px;
    height: 32px;
    box-sizing: border-box;
  }

  .image-input {
    display: none;
  }

  .page-controls {
    display: flex;
    column-gap: 10px;
    align-items: center;
    :global(.message) {
      margin-right: 10px;
      color: #666;
    }
    .delete-button :global(.button) {
      --bg-color: #e37777;
      --border-color: #cb6666;
    }
    @keyframes bgPulse {
      0% { border-color: #bbb;  }
      100% { border-color: #999;
        box-shadow: inset #a0b6e455 0 0 15px 0px, #c5cddf 0 0 2px 1px;
      }
    }
    .save-button :global(.button:not(:disabled)) {
      animation: 1s ease-in 0s infinite alternate bgPulse;

    }
  }

  :global(.spinner) {
    --color: black;
    scale: 0.5;
  }

  .editor-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    :global(.prosemirror-container) {
      flex: 1;
    }
  }

  .life-cycle {
    position: absolute;
    z-index: 1;
    right: 10px;
    margin-top: 60px;
  }

</style>