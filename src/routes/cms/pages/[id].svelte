<script lang="ts">
  import PageEditor from "$lib/components/cms/PageEditor.svelte";
  import type { Author, SubTypes, Tag } from "$lib/types";

  export let users: Author[];
  export let page: SubTypes.Page.Full = {} as SubTypes.Page.Full;
  export let allTags: Tag[];
</script>

<PageEditor {users} {page} {allTags} />