<script lang="ts">
  import type { PageTag } from "$lib/types";
  import Tag from "./Tag.svelte";

  export let tags: PageTag[] = [];
  export let width:number = 200;
</script>

<div class="tag-container" style="max-width:{width}px">
  {#each tags as tag}
    <Tag {tag}/>
  {/each}
</div>

<style>
  .tag-container {
      display: inline-block;
  }
</style>