<script lang="ts">
  import { openModal } from 'svelte-modals'
  import { goto } from "$app/navigation";
  import Editor from "$lib/Editor/Editor.svelte";
  import Spinner from "$lib/components/Spinner.svelte";
  import type { CompletePage, UserInfo } from '$lib/types';
  import MultiSelect, { Option } from 'svelte-multiselect';
  import { staticUrl } from "$lib/helpers";
  import type { Prisma } from "@prisma/client";
  import DeleteModal from "$lib/components/DeleteModal.svelte";
  import { uploadImage } from '$lib/api';

  export let users: UserInfo[];
  export let page: CompletePage;

  const MAX_LENGTH = 140;

  let newPage = !page;

  type PageType = "Case Study" | "Chapter";
  let pageType: PageType = page?.caseStudy ? "Case Study" : "Chapter";

  let title: string = page?.title;
  let slug: string = page?.slug;
  let summary: string = page?.chapter?.summary;
  let authors: Option[] = page?.chapter?.authors?.map(author => ({label: author.name, value: author.id}));
  let imgPath: string = page?.img;
  let content: {[key: string]: any} = page?.content as Prisma.JsonObject;

  let keyTakeaways: string[] = page?.chapter? page.chapter.keyTakeaways : [];
  let currentTakeawayText: string = '';

  let editor: Editor;
  let uploadingImage = false;
  let saving = false;
  let deleting = false;
  let autoPopulateSlug = !slug;

  let name: string = page?.caseStudy?.name;
  let established: number = page?.caseStudy?.established;
  let size: number = page?.caseStudy?.size;
  let governance: string = page?.caseStudy?.governance;
  let staff: string = page?.caseStudy?.staff;
  let budget: string = page?.caseStudy?.budget;
  let budgetLevel: string = page?.caseStudy?.budgetLevel;
  let lat: number = page?.caseStudy?.lat;
  let long: number = page?.caseStudy?.long;

  let milestones:  {[key: string]: any} = page?.caseStudy?
    page.caseStudy.milestones as Prisma.JsonObject : {type: 'milestones', content: []}
  let milestoneYear: number;
  let milestoneText: string;

  $: if (autoPopulateSlug) {
    slug = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  }

  const authorOptions = users.map(u => ({
    value: u.id,
    label: u.name,
    preselected: authors && authors.some(a => a.value === u.id),
  }));

  function getFormData() {
    return {
      title,
      slug,
      img: imgPath,
      content: editor.getDocumentJson(),
      caseStudy: pageType === "Case Study"
        ? {
          name, established, size, governance,
          staff, budget, budgetLevel, lat, long, milestones
        }
        : undefined,
      chapter: pageType === "Chapter"
        ? {
          authors: authors?.map(a => a.value),
          summary,
          keyTakeaways
        }
        : undefined
    };
  }

  async function savePost() {
    saving = true;
    const formData = getFormData();
    const body = JSON.stringify(formData);

    const response = await (
      newPage
        ? fetch('/api/pages/create', { method: 'PUT', body })
        : fetch(`/api/pages/${page.id}`, { method: 'PATCH', body })
    );

    saving = false;

    if (response.ok) {
      if (newPage) {
        const json = await response.json();
        goto(`/cms/pages/${json.id}`);
      }
    } else {
      console.error(response);
    }
  }

  async function deletePage() {
    deleting = true;
    await fetch(`/api/pages/${page.id}`, {
      method: 'DELETE',
    });
    goto('/cms/pages');
  }

  async function onClickDelete() {
    openModal(DeleteModal, { onYes: deletePage })
  }

  $: sharedFieldsComplete = title && slug && imgPath;

  $: selectedTypeFieldsComplete = pageType === "Case Study"
    ? name && established && size && governance && staff && budget && budgetLevel && lat && long
    : summary && authors?.length && keyTakeaways.length;

  $: editable = !saving && !deleting;
  $: saveable = !saving && !deleting && sharedFieldsComplete && selectedTypeFieldsComplete;


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

  const onClickSaveTakeaway = () => {
    if (currentTakeawayText.length > 0){
      keyTakeaways = [...keyTakeaways, currentTakeawayText];
      currentTakeawayText = "";
    }
  };

  const onClickDeleteTakeaway = (index: number) => {
    keyTakeaways.splice(index, 1);
    keyTakeaways = keyTakeaways;
  };

  const onClickSaveMilestone = () => {
    const yearAlreadyExists = milestones.content.findIndex((m) => m.year === milestoneYear);
    if (yearAlreadyExists != -1){
      milestones.content[yearAlreadyExists].content.push({type: 'text', text: milestoneText});
    }
    else {
      milestones.content.push({year: milestoneYear, content: [
        {type: 'text', text: milestoneText}
      ]});
    }
    milestoneText = '';
    milestones = milestones;
  }

  const onClickDeleteMilestone = (yearIndex: number, milestoneIndex: number) => {
    milestones.content[yearIndex].content.splice(milestoneIndex, 1);
    if (!milestones.content[yearIndex].content.length) {
      milestones.content.splice(yearIndex, 1);
    }
    milestones = milestones;
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
    <input type="text" id="title" bind:value={title} disabled={!editable} />

    <label for="slug">Slug</label>
    <input class="slug" type="text" id="slug" bind:value={slug} disabled={!editable}
      on:beforeinput={onBeforeInputSlug}
      on:change={onChangeSlug}
    />

    <label for="image">Image</label>
    <div>
      <input type="file" id="image" on:change={onImageChange} accept=".jpg, .jpeg" disabled={!editable} >
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
      <input type="text" id="name" bind:value={name} disabled={!editable} />

      <label for="established">Year established</label>
      <input type="number" id="established" bind:value={established} disabled={!editable} maxlength="4"/>

      <label for="size">Size</label>
      <input type="number" id="size" bind:value={size} disabled={!editable}/>

      <label for="governance">Governance</label>
      <textarea type="text" id="governance" bind:value={governance} rows="4" maxlength={MAX_LENGTH} disabled={!editable}/>

      <label for="staff">Staff</label>
      <textarea type="text" id="staff" bind:value={staff} rows="4" maxlength={MAX_LENGTH} disabled={!editable}/>

      <label for="budget">Budget</label>
      <textarea type="text" id="budget" bind:value={budget} rows="4" maxlength={MAX_LENGTH} disabled={!editable}/>

      <label for="budgetLevel">Budget level</label>
      <textarea type="text" id="budgetLevel" bind:value={budgetLevel} rows="4" maxlength={MAX_LENGTH} disabled={!editable}/>

      <label for="latitude">Latitude coordinate</label>
      <input type="number" id="latitude" bind:value={lat} disabled={!editable} placeholder="e.g. 40.7128"/>

      <label for="altitude">Altitude coordinate</label>
      <input type="number" id="altitude" bind:value={long} disabled={!editable} placeholder="e.g. -74.0059"/>


      <label for="milestones">Add milestone</label>
      <div>
        <input type="number" id="milestoneYear" bind:value={milestoneYear} disabled={!editable} placeholder="Year" class="year-selector"/>
        <textarea type="text" id="milestones" bind:value={milestoneText} rows="4" maxlength={MAX_LENGTH} disabled={!editable} class="milestone-area"/>
        <button disabled={!milestoneYear || !milestoneText} on:click={onClickSaveMilestone}>Save milestone</button>
      </div>

      <div class="list">
        {#each milestones.content as m, i}
        {m.year}
          {#each m.content as x, y}
            <div class="list-item">
              {x.text}
              <button on:click={() => onClickDeleteMilestone(i, y)}>&times;</button>
            </div>
          {/each}
        {/each}
      </div>


    {:else}
      <label for="summary">Summary</label>
      <textarea type="text" id="summary" bind:value={summary} rows=5 disabled={!editable} />

      <label for="authors">
        Authors
      </label>
      <MultiSelect bind:selected={authors} options={authorOptions} disabled={!editable} />

      <label for="keytakeaway">Add key takeaway</label>
      <div>
        <textarea type="text" id="takeawayName" bind:value={currentTakeawayText} disabled={!editable}/>
        <button disabled={!currentTakeawayText} on:click={onClickSaveTakeaway}>Save takeaway</button>
      </div>

      <div class="list">
        {#each keyTakeaways as k, i}
          <div class = "list-item">
            {k}
            <button on:click={() => onClickDeleteTakeaway(i)}>&times;</button>
          </div>
        {/each}
      </div>
    {/if}

  </div>


  <div class="controls">
    <button class="save" on:click={savePost} disabled={!saveable}>Save</button>
    {#if saving}<Spinner />{/if}
    {#if !newPage}
      <div class="spacer"></div>
      <button class="delete" on:click={onClickDelete}>Delete</button>
    {/if}
  </div>
</div>


<div class="editor-container">
  <Editor bind:this={editor} initialDoc={content} />
</div>

<style lang="scss">

  .milestone-area {
    width: 100rem;
  }

  .year-selector {
    width: 100px;
  }

  .list {
    display: inline-block !important;
    width: 100rem;

    button {
      float: right;
      border: none;
      background: transparent;
      padding: 0;
      margin: 0;
      color: #dc4f21;
      font-size: 23px;
      font-weight: bold;
      cursor: pointer;
    }
  }

  .list-item {
    list-style: none;
    padding: 6px 10px;
    border-bottom: 1px solid #ddd;
  }

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

  .controls {
    margin-top: 20px;
    margin-left: 100px;
    display: flex;
    column-gap: 10px;
    align-items: center;
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