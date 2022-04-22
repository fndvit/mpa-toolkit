<script lang="ts">
  import type { TagParameters } from './TagContainer.svelte';

  export let data: TagParameters;
  export let onClickFn = () => {};

  let style: string;
  let calcStyle = () => {
    if (data.alt === 'grey') {
      style = 'tag-area alternative';
    } else if (data.alt === 'fading') {
      style = 'tag-area fading';
    } else {
      style = 'tag-area';
    }
  };
  $: if (data.alt) calcStyle();
</script>


<div class={style} on:click={onClickFn} tabindex="0">{data.tag}</div>

<style>
  .alternative {
    background: #dadce0 !important;
  }
  .fading {
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