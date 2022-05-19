<script lang="ts">
  import type { PageTag } from "$lib/types";
  import Tag from "./Tag.svelte";

  export let tags: PageTag[] = [];
  export let color: string = '#fbe26b';
</script>

<div class="tag-container">
  {#each tags as tag}
    <Tag {tag} {color}/>
  {/each}
</div>
