<script lang="ts">
  import PageEditor from "$lib/components/cms/PageEditor.svelte";
  import type { SubTypes, Tag, UserInfo } from "$lib/types";

  export let users: UserInfo[];
  export let page: SubTypes.Page = {} as SubTypes.Page;
  export let allTags: Tag[];
</script>

<PageEditor {users} {page} {allTags} />