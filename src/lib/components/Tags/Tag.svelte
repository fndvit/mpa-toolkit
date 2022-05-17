<script lang="ts">
  import type { PageTag } from "$lib/types";

  export let tag: PageTag;

  $: fade = tag.category == 'SECONDARY';

</script>

<div class="tag-area" class:fade tabindex="0">{tag.tag.value? tag.tag.value : tag.tag}</div>

<style>
  .fade {
    background: rgba(251, 226, 107, 0.6) !important;
  }
  .tag-area {
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
    font-family: 'Montserrat';
    background: #fbe26b;
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