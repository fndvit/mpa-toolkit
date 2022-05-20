<script lang="ts">
  import type { SubTypes } from "$lib/types";

  export let tag: SubTypes.PageTag;

  $: secondary = tag.category == 'SECONDARY';
</script>

<a
  href={`/tag/${tag.tag.id}`}
  class="tag"
  class:secondary
  tabindex="0"
  style=""
>
  <span>
    {tag.tag.value? tag.tag.value : tag.tag}
  </span>
</a>

<style lang="scss">
  .tag {
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
    font-family: 'Montserrat';
    font-weight: 400;
    line-height: 18px;
    text-align: center;
    padding: 4px 12px;
    border-radius: 18px;
    overflow: hidden;
    margin: 0.25rem 0.5rem 0.25rem 0rem;
    color: black;
    position: relative;
    white-space: nowrap;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: var(--tag-bg, #fbe26b);
    }
    &.secondary::before {
        opacity: var(--tag-bg-fade, 0.4);
      }
    span {
      position: relative;
    }
  }
  .tag:hover {
    box-shadow: inset 0px 2px 12px rgba(0, 0, 0, 0.2);
  }
</style>