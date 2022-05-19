<script lang="ts">
  import PageEditor from "$lib/components/cms/PageEditor.svelte";
  import { createEmptyPage } from "$lib/helpers/content";
  import type { Tag, UserInfo } from "$lib/types";

  export let users: UserInfo[];
  export let allTags: Tag[];
  const page = createEmptyPage('chapter');
</script>

<PageEditor {users} {allTags} {page} />