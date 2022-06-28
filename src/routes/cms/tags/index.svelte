<script lang="ts">
  import TagsEditor from "$lib/components/cms/TagsEditor.svelte";
  import type { SubTypes } from '$lib/types';

  export let tags: SubTypes.Tag.WithPageCount[];
</script>

<TagsEditor {tags}/>