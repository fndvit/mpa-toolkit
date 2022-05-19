<script lang="ts">
  import type { SubTypes } from "$lib/types";

  export let tag: SubTypes.Tag;
  export let color: string = '#fbe26b';

  $: fade = tag.category == 'SECONDARY';
</script>

<a
  href={`/tag/${tag.tag.id}`}
  class="tag-area"
  class:fade
  tabindex="0"
  style="background: {color + (fade ? '60' : '')};"
>
  {tag.tag.value? tag.tag.value : tag.tag}
</a>

<style>
  .tag-area {
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
    font-family: 'Montserrat';
    font-weight: 400;
    line-height: 18px;
    text-align: center;
    padding: 4px 12px;
    border-radius: 18px;
    margin: 0.25rem 0.5rem 0.25rem 0rem;
    color: black;
  }
  .tag-area:hover {
    box-shadow: inset 0px 2px 12px rgba(0, 0, 0, 0.2);
  }
</style>