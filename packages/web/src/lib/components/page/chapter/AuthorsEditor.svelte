<script lang="ts">
  import type { Author, Chapter } from '@mpa/db';
  import MultiSelect from 'svelte-multiselect';
  import { page } from '$app/stores';

  export let authors: Chapter['authors'] = [];
  export let disabled = false;

  const allAuthors = $page.data.authors as Author[];
  const allAuthorOptions = allAuthors.map(u => ({
    value: u.id,
    label: u.name,
    user: u
  }));

  let authorIds = new Set(authors.map(author => author.id));
  let authorOptions = allAuthorOptions.filter(o => authorIds.has(o.user.id));
  $: authors = authorOptions.map(a => a.user);
</script>

<div class="author-editor">
  <MultiSelect placeholder="Add an author" bind:selected={authorOptions} options={allAuthorOptions} {disabled} />
</div>

<style lang="stylus">
  .author-editor {
    --sms-selected-bg: transparent;
    --sms-border: none;
    --sms-selected-li-padding: 0;
    :global(.multiselect > svg) {
      display: none;
    }
    :global(button.remove-all) {
      display: none;
    }
    :global(div.multiselect > ul.selected > li:nth-last-child(3)::after) {
      content: 'and';
      margin-left: 8px;
      display: block;
    }
    :global(div.multiselect > ul.selected > li button) {
      opacity: 0.4;
    }
    :global(div.multiselect > ul.selected > li) {
      font-size: 16px;
      font-weight: 700;
    }
    :global(div.multiselect) {
      z-index: authors-list;
    }
  }

</style>
