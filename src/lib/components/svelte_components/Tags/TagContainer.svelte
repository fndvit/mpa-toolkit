
<script lang="ts">
  import Tag from "./Tag.svelte";
  import type {TagParameters} from './Tag.svelte';

  export let tags: TagParameters[];
  export let width: number;
  export let editable: boolean = false;
  export let group: number = -1;

  let addTag = () => {
    let newTag: TagParameters = {
      tag : 'New Tag',
      alt : 'fading',

    }
    tags.push(newTag);
    tags = tags;
  }

  let removeTag = (event) => {
    console.log(event.detail.id)
    tags.splice(event.detail.id, 1);
    tags = tags;
  }
</script>

<div class="tag-container" style="max-width:{width}px">

  {#each tags as t, i}
         <Tag data={t} editable id={i} on:removeTag={removeTag}/>
  {/each}
  {#if editable}
    <div class="add-tag" on:click={addTag}>
      &#43;
    </div>
  {/if}
</div>

<style>
  .tag-container {
      display: inline-block;
  }

  .add-tag{
    border-radius: 50%;
    width: 25px;
    background: white;
    height: 25px;
    font-size: 30px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.5s;
  }
  .add-tag:hover{
    background: rgb(190, 190, 190);
  }
</style>