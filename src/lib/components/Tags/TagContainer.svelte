<script lang="ts">
  import type { PageTag } from "$lib/types";
  import Tag from "./Tag.svelte";

  export let tags: PageTag[] = [];
</script>

<div class="tag-container">
  {#each tags as tag}
    <Tag {tag}/>
  {/each}
</div>
