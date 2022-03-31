
<script lang="ts">
  import Tag from "./Tag.svelte";
  import type {TagParameters} from './Tag.svelte';

  export let tags: TagParameters[];
  export let width: number;
</script>

<div class="tag-container" style="max-width:{width}px">

  {#each tags as t}
         <Tag data={t}/>
  {/each}
</div>

<style>
  .tag-container {
      display: inline-block;
  }
</style>