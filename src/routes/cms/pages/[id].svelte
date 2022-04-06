<script lang="ts">
  import { openModal } from 'svelte-modals'
  import { goto } from "$app/navigation";
  import Editor from "$lib/Editor/Editor.svelte";
  import Spinner from "$lib/components/Spinner.svelte";
  import type { Page, TagInfo, UserInfo, Tag } from '$lib/types';
  import MultiSelect, { Option } from 'svelte-multiselect';
  import { staticUrl } from "$lib/helpers";
  import type { Prisma } from "@prisma/client";
  import DeleteModal from "$lib/components/DeleteModal.svelte";
  import LifeCycle, { LifeCycleTags, TagEnum, TagCategory } from '$lib/components/svelte_components/LifeCycle/LifeCycle.svelte';

  // export let pageId: number;
  export let users: UserInfo[];
  export let page: Page & { authors: UserInfo[], tags: TagInfo[] };
  export let tags: Tag[];

  let newPage = !page;
  let title: string = page && page.title;
  let slug: string = page && page.slug;
  let summary: string = page && page.summary;
  let authors: Option[] = page && page.authors.map(author => ({label: author.name, value: author.id}));
  let pageTags: (Option & { category: number })[] = page && page.tags.map(t => ({label: t.tag.value, value: t.tag.id, typeId: t.tag.typeId, category: t.category.id}));
  let imgPath: string = page && page.img;
  let content: {[key: string]: any} = page && page.content as Prisma.JsonObject;
  let editor: Editor;
  let uploadingImage = false;
  let saving = false;
  let deleting = false;
  let autoPopulateSlug = !slug;
  let tagsOptions: LifeCycleTags =  <LifeCycleTags>{};;
  let tagsSelected: LifeCycleTags = <LifeCycleTags>{};

  $: if (autoPopulateSlug) {
    slug = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  }

  const authorOptions = users.map(u => ({
    value: u.id,
    label: u.name,
    preselected: authors && authors.some(a => a.value === u.id),
  }));

  const testOptions:Option[] = tags.map(t => ({
    value: t.id,
    label: t.value,
    [t.id]: t.typeId,
    preselected: (pageTags && pageTags.find(pt => t.id === pt.value))? true: false,
  }));

  const selectTagsOptions = (tagType: TagEnum, category?: TagCategory) => tags.filter(t => t.typeId === tagType).map(t => ({
    value: t.id,
    label: t.value,
    [t.id]: t.typeId,
    preselected: (pageTags && pageTags.find(pt => t.id === pt.value && (category === pt.category || category === undefined)))? true: false,
  }));

  tagsOptions = {
      wherein: {
        primary: selectTagsOptions(TagEnum.Wherein, TagCategory.Primary),
        secondary: selectTagsOptions(TagEnum.Wherein, TagCategory.Secondary),
      },
      whatsabout: selectTagsOptions(TagEnum.Whatsabout),
      goodfor: selectTagsOptions(TagEnum.Goodfor),
  };
  tagsSelected = {
      wherein: {
        primary: [],
        secondary: [],
      },
      whatsabout: [],
      goodfor: [],
  };


  function getFormData() {
    const authorIds = authors.map(a => a.value as number);
    const tagsIds = pageTags.map(a => a.value  as number);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('summary', summary);
    formData.append('image', imgPath);
    formData.append('authors', authorIds.join(','));
    formData.append('tags', tagsIds.join(','));
    formData.append('content', JSON.stringify(editor.getDocumentJson()));
    return formData;
  }

  async function savePost() {
    saving = true;
    const formData = getFormData();

    const response = await (
      newPage
      ? fetch('/api/pages/create', { method: 'PUT', body: formData })
      : fetch(`/api/pages/${page.id}`, { method: 'PATCH', body: formData })
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

  $: saveable = !saving && !deleting && title && summary && imgPath && authors.length > 0;
  $: editable = !saving && !deleting;

  const onImageChange: svelte.JSX.EventHandler<FormDataEvent, HTMLInputElement> = async (e) => {
    const file = e.currentTarget.files[0];
    const formData = new FormData();
    formData.append('image', file);
    uploadingImage = true;
    imgPath = '';
    const response = await fetch('/api/image/upload', {
      method: 'PUT',
      body: formData,
    });
    const body = await response.json();
    imgPath = body.path;
    uploadingImage = false;
  }

  const onChangeSlug: svelte.JSX.ChangeEventHandler<HTMLInputElement> = e => {
    autoPopulateSlug = e.currentTarget.value.length === 0;
  };

  const onBeforeInputSlug: svelte.JSX.EventHandler<InputEvent, HTMLInputElement> = e => {
    const validChars = /[a-zA-Z0-9-]/;
    if (!validChars.exec(e.data)) e.preventDefault();
  }
</script>

<div class="meta">
  <LifeCycle tagsOptions={tagsOptions} tagsSelected={tagsSelected} editable={true}/>
  <h1>{#if newPage}New Page{:else}Edit Page{/if}</h1>

  <div class="fields">

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

    <label for="summary">Summary</label>
    <textarea type="text" id="summary" bind:value={summary} rows=5 disabled={!editable} />

    <label for="authors">
      Authors
    </label>
    <MultiSelect bind:selected={authors} options={authorOptions} disabled={!editable} />

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
  .meta {
    padding: 0 20px 20px;
  }
  label {
    display: block;
  }

  .fields {
    display: grid;
    grid-template-columns: 100px 1fr;
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
    // color: ;
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

</style>