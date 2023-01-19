<script lang="ts">
  import type { Tag } from '@mpa/db';
  import MultiSelect from 'svelte-multiselect/MultiSelect.svelte';
  import type { Option } from 'svelte-multiselect';

  export let tags: Tag[] = [];
  export let activeTags: Tag[] = [];

  let selected: (Option & { value: Tag })[] = [];

  $: activeTags = selected.map(o => o.value);
</script>

<div class="tag-filter">
  <MultiSelect
    outerDivClass="tag-multiselect"
    liSelectedClass="tag-multiselect__option--selected"
    placeholder="Select a tag"
    bind:selected
    options={tags.map(t => ({ label: t.value, value: t }))}
  />
</div>

<style lang="postcss">
  .tag-filter {
    --tag-spacing: 0.5rem;

    display: flex;
    flex-wrap: wrap;
    column-gap: var(--tag-spacing);
    row-gap: var(--tag-spacing);

    :global(.tag-multiselect) {
      font-size: 0.75rem;
      width: 100%;
      max-width: 600px;
    }
  }
</style>
