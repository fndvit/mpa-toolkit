<script context='module' lang='ts'>
  export interface TagParameters {tag: string, alt: string};
</script>
<script lang="ts">
  import Tag from "./Tag.svelte";

  export let tags: TagParameters[];
  export let width:number = 200;
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