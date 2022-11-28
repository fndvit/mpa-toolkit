<script lang="ts">
  import type { APIRequests, Author, Chapter, Page, PageTag, Tag } from '@mpa/db';
  import type { Unpacked } from '@mpa/utils';
  import { createLookup, slugify } from '@mpa/utils';
  import clone from 'clone';
  import { openModal } from 'svelte-modals';
  import Editor from '../cms/editor/Editor.svelte';
  import PageContent from './body/PageContent.svelte';
  import CaseStudyHead from './casestudy/CaseStudyHead.svelte';
  import ChapterHead from './chapter/ChapterHead.svelte';
  import LifeCycle from './shared/LifeCycle.svelte';
  import PageSplash from './shared/PageSplash.svelte';
  import { compareDeep } from '$lib/utils';
  import { insertInTextArea, onHoverEl } from '$lib/helpers/utils';
  import { getPageTypeStr } from '$lib/helpers/content';
  import { DeleteModal, IconButton, Popper, Spinner, toaster } from '$lib/components/generic';
  import * as api from '$lib/api';
  import { page as pageStore } from '$app/stores';
  import { goto } from '$app/navigation';
  import { editorStore } from '../cms/editor/editorStore';

  export let authors: Author[];
  export let allTags: Tag[];
  export let page: Page;

  const pageTagToRequestTag = (t: PageTag): Unpacked<APIRequests.Page['tags']> => ({
    id: t.tag.id,
    category: t.category
  });

  const chapterToRequest = (c: Chapter): APIRequests.Page['chapter'] => ({
    ...c,
    authors: c.authors.map(a => a.id)
  });

  const convertPageToPageRequest = (p: Page): APIRequests.Page => {
    const _p = clone(p);
    return {
      ..._p,
      tags: _p.tags?.map(pageTagToRequestTag) || [],
      chapter: _p.chapter ? chapterToRequest(_p.chapter) : undefined,
      caseStudy: _p.caseStudy ? _p.caseStudy : undefined
    };
  };

  const { protocol, hostname, port } = $pageStore.url;
  const URL_PREFIX = `${protocol}//${hostname}${port ? `:${port}` : ''}/`;
  const authorLookup = createLookup(authors, a => a.id.toString());
  const tagLookup = createLookup(allTags, t => t.id.toString());
  const pageId = page.id;
  let showElTooltip: (el: HTMLElement) => void;
  let pageType: 'Case Study' | 'Chapter' = page.caseStudy ? 'Case Study' : 'Chapter';
  let _page = convertPageToPageRequest(page);
  let chapter = clone(page.chapter);
  let tags: PageTag[] = page.tags || [];

  $editorStore.isNewPage = !page.id;
  $editorStore.savedPage = clone(_page);
  let uploadingImage = false;
  let deleting = false;
  let autoPopulateSlug = !_page.slug;
  let imageInput: HTMLInputElement;
  let previewPage: Page;

  async function onSave() {
    $editorStore.saving = true;

    if ($editorStore.isNewPage) {
      const { id } = await api.page.create(_page);
      window.location.href = `/cms/pages/${id}`;
    } else {
      await api.page.update(pageId, _page);
    }
    $editorStore.saving = false;
    toaster.done('Saved');
    $editorStore.savedPage = clone(_page);
  }

  async function onDeleteModalYes() {
    deleting = true;
    const success = await api.page.delete(pageId);
    if (!success) toaster.error('Delete failed');
    else goto('/cms/pages');
  }

  async function onDelete() {
    openModal(DeleteModal, {
      onYes: onDeleteModalYes,
      title: 'Delete page',
      message: 'Are you sure you want to delete this page?'
    });
  }

  const onImageChange: svelte.JSX.EventHandler<FormDataEvent, HTMLInputElement> = async e => {
    if (e.currentTarget.files?.length) {
      uploadingImage = true;
      _page.img = await api.image.upload(e.currentTarget.files[0]);
      uploadingImage = false;
    }
  };

  const onChangeSlug: svelte.JSX.ChangeEventHandler<HTMLInputElement> = e => {
    autoPopulateSlug = e.currentTarget.value.length === 0;
  };

  const onBeforeInputSlug: svelte.JSX.EventHandler<InputEvent, HTMLInputElement> = e => {
    const validChars = /[a-zA-Z0-9-]/;
    if (e.data === ' ') {
      e.preventDefault();
      insertInTextArea('-', e.target as HTMLInputElement);
    } else if (e.data && !validChars.exec(e.data)) return e.preventDefault();
    else autoPopulateSlug = false;
  };

  $: if (autoPopulateSlug) {
    _page.slug = pageType === 'Case Study' ? slugify(_page.caseStudy!.name) : slugify(_page.title);
  }

  $: _page.tags = tags.map(pageTagToRequestTag);
  $: sharedFieldsComplete = !!(_page.title && _page.slug);
  $: disabled = $editorStore.saving || deleting;
  $: _page.chapter = chapter ? chapterToRequest(chapter) : undefined;
  $: $editorStore.page = _page;
  $: $editorStore.dirty = !compareDeep(_page, $editorStore.savedPage);
  $: $editorStore.saveable = $editorStore.dirty && !$editorStore.saving && !deleting && sharedFieldsComplete;
  $: if ($editorStore.preview) {
    previewPage = {
      ..._page,
      id: null,
      readTime: null,
      tags: _page.tags.map<PageTag>(t => ({
        tag: tagLookup[t.id]!,
        category: t.category
      })),
      chapter: !_page.chapter
        ? undefined
        : {
            ..._page.chapter,
            authors: _page.chapter.authors.map<Author>(a => authorLookup[a.toString()]!)
          }
    };
  }
</script>

<Popper bind:load={showElTooltip} />
<div
  class="page page-editor"
  class:page-editor--editing={!$editorStore.preview}
  class:preview={$editorStore.preview}
  class:is-new-page={$editorStore.isNewPage}
  data-pagetype={getPageTypeStr(page)}
  use:onHoverEl={['.problem', el => showElTooltip(el)]}
>
  <div class="meta">
    <div class="top-controls">
      <input
        class="image-input"
        bind:this={imageInput}
        type="file"
        on:change={onImageChange}
        accept=".jpg, .jpeg"
        {disabled}
      />

      <div class="slug">
        <span class="url-prefix">{URL_PREFIX}</span>
        <input
          type="text"
          id="slug"
          bind:value={_page.slug}
          {disabled}
          on:beforeinput={onBeforeInputSlug}
          on:change={onChangeSlug}
        />
      </div>

      <IconButton icon="image" {disabled} on:click={() => imageInput.click()} />
      <div class="spinner" class:hidden={!uploadingImage}>
        <Spinner />
      </div>
    </div>

    <PageSplash bind:page={_page} editable={!$editorStore.preview} />
    {#if pageType === 'Case Study'}
      <CaseStudyHead bind:caseStudy={_page.caseStudy} editable={!$editorStore.preview} tags={page.tags} />
    {:else}
      <ChapterHead bind:chapter editable={!$editorStore.preview} tags={page.tags} />
    {/if}
  </div>

  <div class="editor-container">
    <div class="life-cycle-editor">
      <LifeCycle {allTags} bind:tags editable />
    </div>
    <Editor bind:content={_page.content} on:save={onSave} on:delete={onDelete} />
    {#if $editorStore.preview}
      <PageContent page={previewPage} />
    {/if}
  </div>
</div>

<style lang="postcss">
  .top-controls {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    width: fit-content;
    margin: auto;
    padding-top: 40px;
    display: flex;
    column-gap: 10px;
    align-items: center;

    :global(.icon-button) {
      --bg-color: #fff9;
      --ib-hover-border-color: transparent;
      --ib-hover-bg: #ddd9;
      --ib-font-size: 1rem;
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
    font: $f-ui;
    width: 550px;
    background: #fff9;
    border: 1px solid #0005;
    border-radius: 2px;
    height: 32px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .url-prefix {
      margin-left: 2px;
      opacity: 0.5;
      margin-right: -2px;
    }

    input {
      border: none;
      border-radius: 0;
      background: transparent;
      flex: 1;
      margin-bottom: 1px;
      text-transform: lowercase;
    }
  }

  .image-input {
    display: none;
  }

  .page-editor {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    :global(.prosemirror-container) {
      flex: 1;

      :global(.problem:not(.svelte-node-view)) {
        background-color: #fdd;
        cursor: pointer;
      }

      :global(.problem[data-problem-name='leading-space']) {
        position: relative;
        display: inline-block;
        min-width: 5px;

        &::before {
          content: 'arrow_right';
          font-family: 'Material Icons';
          font-size: 1.25rem;
          color: #f55;
          display: block;
          position: absolute;
          right: calc(100% + 10px);
        }

        &::after {
          content: ' ';
          display: inline-block;
        }
      }

      :global(.problem[data-problem-name='todo']) {
        background-color: #aaf;
      }

      :global(.problem-highlight) {
        background-color: #faa;
      }
    }
  }

  .life-cycle-editor {
    position: absolute;
    z-index: 1;
    right: 10px;
    margin-top: 60px;
    max-width: 350px;
  }

  .preview {
    padding-top: 51px;

    :global(.menu-bar) {
      position: fixed;
    }

    .top-controls,
    .life-cycle-editor,
    :global(.editor-content),
    :global(.menu-bar .left-section),
    :global(.draft-button) {
      display: none;
    }
  }
</style>
