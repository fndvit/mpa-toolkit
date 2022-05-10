<script lang="ts">
  import MultiSelect, { Option } from "svelte-multiselect";
  import type { UserInfo } from '$lib/types';

  export let authors: Pick<UserInfo, 'id' | 'name'>[] = [];
  export let allAuthors: UserInfo[];
  export let disabled = false;

  type AuthorOption = Option & {
    id: number;
    value: number;
    label: string;
  };

  let authorOptions = authors.map<AuthorOption>(author => ({id: author.id, label: author.name, value: author.id}));

  const allAuthorOptions = allAuthors.map<AuthorOption>(u => ({
    id: u.id,
    value: u.id,
    label: u.name,
    preselected: authorOptions && authorOptions.some(a => a.value === u.id),
  }));

  $: authors = authorOptions.map(a => ({ id: a.value, name: a.label }));

</script>

<MultiSelect bind:selected={authorOptions} options={allAuthorOptions} {disabled} />
