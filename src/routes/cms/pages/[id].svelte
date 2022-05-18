<script lang="ts">
  import LifeCycle from '$lib/components/LifeCycle/LifeCycle.svelte';
  import MilestonesEditor from '$lib/components/cms/MilestonesEditor.svelte';
  import KeyTakeawaysEditor from '$lib/components/cms/KeyTakeawaysEditor.svelte';
  import { openModal } from 'svelte-modals'
  import { goto } from "$app/navigation";
  import Editor from "$lib/Editor/Editor.svelte";
  import Spinner from "$lib/components/Spinner.svelte";
  import type { CompletePage, PageTag, Tag, UserInfo } from '$lib/types';
  import type { Prisma } from "@prisma/client"
  import { staticUrl } from "$lib/helpers/content";
  import DeleteModal from "$lib/components/DeleteModal.svelte";
  import { createPage, deletePage, updatePage, uploadImage } from '$lib/api';
  import AuthorsEditor from '$lib/components/cms/AuthorsEditor.svelte';
  import LoadingButton from '$lib/components/LoadingButton.svelte';
  import Button from '$lib/components/Button.svelte';
  import TimedMessage from '$lib/components/TimedMessage.svelte';

  export let users: UserInfo[];
  export let page: CompletePage;
  export let allTags: Tag[];

  const MAX_LENGTH = 140;

  let newPage = !page;

  type PageType = "Case Study" | "Chapter";
  let pageType: PageType = page?.caseStudy ? "Case Study" : "Chapter";

  let title: string = page?.title;
  let slug: string = page?.slug;
  let imgPath: string = page?.img;
  let content: {[key: string]: any} = page?.content as Prisma.JsonObject;
  let tags: PageTag[] = page?.tags || [];
  let { pageId: _, ...caseStudy } = page?.caseStudy || {} as typeof page.caseStudy;
  let { pageId: __, ...chapter } = page?.chapter || {} as typeof page.chapter;

  let editor: Editor;
  let uploadingImage = false;
  let saving = false;
  let deleting = false;
  let autoPopulateSlug = !slug;

  let showSaveStatusText: TimedMessage['$$prop_def']['showMessage'];

  $: if (autoPopulateSlug) {
    slug = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  }

  function getFormData() {
    return {
      title,
      slug,
      tags,
      img: imgPath,
      content: editor.getDocumentJson(),
      caseStudy: pageType === "Case Study" ? caseStudy : undefined,
      chapter: pageType === "Chapter"
        ? { ...chapter, authors: chapter.authors?.map(a => a.id) }
        : undefined
    };
  }

  async function onClickSave() {
    saving = true;
    showSaveStatusText('Saving...');
    const formData = getFormData();
    const body = JSON.stringify(formData);

    if (newPage) {
      const {id} = await createPage(formData);
      window.location.href = `/cms/pages/${id}`;
    } else {
      await updatePage(page.id, formData);
      showSaveStatusText('Saved');
    }
    saving = false;
  }

  async function onDeleteModalYes() {
    deleting = true;
    await deletePage(page.id);
    goto('/cms/pages');
  }

  async function onClickDelete() {
    openModal(DeleteModal, { onYes: onDeleteModalYes })
  }

  $: sharedFieldsComplete = title && slug && imgPath;

  const isCaseStudySaveable = (cs: typeof caseStudy) => [
      "name", "established", "size", "governance",
      "staff", "budget", "budgetLevel", "lat", "long"
    ].every(r => cs[r])

  const isChapterSaveable = ({summary, authors, keyTakeaways}: typeof chapter) =>
    summary && authors?.length && keyTakeaways?.length;

  $: disabled = saving || deleting;
  $: saveable = !saving && !deleting && sharedFieldsComplete
    && (pageType === "Case Study" ? isCaseStudySaveable(caseStudy) : isChapterSaveable(chapter));

  const onImageChange: svelte.JSX.EventHandler<FormDataEvent, HTMLInputElement> = async (e) => {
    uploadingImage = true;
    imgPath = await uploadImage(e.currentTarget.files[0]);
    uploadingImage = false;
  };

  const onChangeSlug: svelte.JSX.ChangeEventHandler<HTMLInputElement> = e => {
    autoPopulateSlug = e.currentTarget.value.length === 0;
  };

  const onBeforeInputSlug: svelte.JSX.EventHandler<InputEvent, HTMLInputElement> = e => {
    const validChars = /[a-zA-Z0-9-]/;
    if (!validChars.exec(e.data)) e.preventDefault();
  }

</script>

<div class="meta">

  <h1>
    {`${newPage ? 'Create a new' : 'Edit a'} ${pageType} Page`}
  </h1>


  <div class="fields">

    <label for="type">Page type</label>
    <div class="radiogroup">
      <label class:selected={pageType === "Chapter"}>
        <input type="radio" bind:group={pageType} value="Chapter" name="pagetype" />
        Chapter
      </label>
      <label class:selected={pageType === "Case Study"}>
        <input type="radio" bind:group={pageType} value="Case Study" name="pagetype" />
        Case Study
      </label>
    </div>

    <label for="title">Title</label>
    <input type="text" id="title" bind:value={title} {disabled} />

    <label for="slug">Slug</label>
    <input class="slug" type="text" id="slug" bind:value={slug} {disabled}
      on:beforeinput={onBeforeInputSlug}
      on:change={onChangeSlug}
    />

    <label for="image">Image</label>
    <div>
      <input type="file" id="image" on:change={onImageChange} accept=".jpg, .jpeg" {disabled} >
    </div>

    <div></div>
    <div>
      {#if uploadingImage}
        <Spinner />
      {:else if imgPath}
        <img class="splashpreview" src={staticUrl(imgPath)} alt="splash" />
      {/if}
    </div>

    {#if pageType === "Case Study"}
      <label for="name">Name</label>
      <input type="text" id="name" bind:value={caseStudy.name} {disabled} />

      <label for="established">Year established</label>
      <input type="number" id="established" bind:value={caseStudy.established} {disabled} maxlength="4"/>

      <label for="size">Size</label>
      <input type="number" id="size" bind:value={caseStudy.size} {disabled}/>

      <label for="governance">Governance</label>
      <textarea type="text" id="governance" bind:value={caseStudy.governance} rows="4" maxlength={MAX_LENGTH} {disabled}/>

      <label for="staff">Staff</label>
      <textarea type="text" id="staff" bind:value={caseStudy.staff} rows="4" maxlength={MAX_LENGTH} {disabled}/>

      <label for="budget">Budget</label>
      <textarea type="text" id="budget" bind:value={caseStudy.budget} rows="4" maxlength={MAX_LENGTH} {disabled}/>

      <label for="budgetLevel">Budget level</label>
      <textarea type="text" id="budgetLevel" bind:value={caseStudy.budgetLevel} rows="4" maxlength={MAX_LENGTH} {disabled}/>

      <label for="latitude">Latitude coordinate</label>
      <input type="number" id="latitude" bind:value={caseStudy.lat} {disabled} placeholder="e.g. 40.7128"/>

      <label for="altitude">Altitude coordinate</label>
      <input type="number" id="altitude" bind:value={caseStudy.long} {disabled} placeholder="e.g. -74.0059"/>

      <MilestonesEditor bind:milestones={caseStudy.milestones} />

    {:else}

      <label for="summary">Summary</label>
      <textarea type="text" id="summary" bind:value={chapter.summary} rows=5 {disabled} />

      <label for="authors">
        Authors
      </label>
      <AuthorsEditor bind:authors={chapter.authors} allAuthors={users} {disabled} />

      <KeyTakeawaysEditor bind:keyTakeaways={chapter.keyTakeaways} {disabled}/>

    {/if}

  </div>
</div>


<div class="editor-container">

  <div class="life-cycle">
    <LifeCycle {allTags} bind:tags editable/>
  </div>

  <Editor bind:this={editor} initialDoc={content}>
    <div slot="menu-extra" class="page-controls">
      <TimedMessage bind:showMessage={showSaveStatusText} />
      <LoadingButton on:click={onClickSave} loading={saving} disabled={!saveable}>Save</LoadingButton>
      {#if !newPage}
        <Button on:click={onClickDelete}>Delete</Button>
      {/if}
    </div>
  </Editor>
</div>



<style lang="scss">

  .meta {
    padding: 0 20px 20px;
  }

  label {
    display: block;
  }

  .fields {
    display: grid;
    grid-template-columns: 150px 1fr;
    row-gap: 20px;
  }

  .fields :global(.multiselect) {
    margin: 0;
  }

  input.slug {
    text-transform: lowercase;
  }

  .page-controls {
    display: flex;
    column-gap: 10px;
    align-items: center;
    :global(.message) {
      margin-right: 10px;
      color: #666;
    }
    :global(.button:last-of-type) {
      --bg-color: #e37777;
      --border-color: #cb6666;
    }
  }

  .controls button {
    padding: 10px 20px;
    border: 1px solid #999;
    border-radius: 3px;
    &:not(:disabled) {
      cursor: pointer;
    }
  }

  .controls .spacer {
    flex: 1;
  }

  button.delete {
    background: rgb(226, 101, 101);
    border-color: rgb(179, 31, 31);
    align-self: flex-end;
  }

  .splashpreview {
    width: 300px;
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

  .radiogroup {
    display: flex;
    column-gap: 10px;
    label {
      padding: 10px 14px;
      background: rgb(191, 191, 191);
      color: white;
      border-radius: 5px;

      &:not(.selected):hover {
        background: rgb(121, 141, 196);
        cursor: pointer;
      }

      &.selected {
        background: rgb(68, 104, 203);
      }
    }

    input {
      display: none
    }
  }
</style>