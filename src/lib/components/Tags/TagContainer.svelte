<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import Tag from "./Tag.svelte";

  export let tags: SubTypes.PageTag[] = [];
</script>

<div class="tag-container">
  {#each tags as tag}
    <Tag {tag}/>
  {/each}
</div>
