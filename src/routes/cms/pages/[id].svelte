<script lang="ts">
  import PageEditor from "$lib/components/cms/PageEditor.svelte";
  import type { Tag, CompletePage, UserInfo } from "$lib/types";

  export let users: UserInfo[];
  export let page: CompletePage = {} as CompletePage;
  export let allTags: Tag[];
</script>

<PageEditor {users} {page} {allTags} />