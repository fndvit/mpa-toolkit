<script lang="ts">
  import ConfigPopup from "../ConfigPopup/ConfigPopup.svelte";
  import type {TagInfo} from '../../../types';
  export let data: TagInfo;
  export let editable: boolean = false;
  export let showModal: boolean = false;
  export let id: number = -1;

  export let onClickFn = () => {
    showModal=true;
    event.stopPropagation();
  };

  const handleSelectChange = (event) => {
    data.value = event.detail.value;
  }

  let element: HTMLElement;
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


<div class={style} on:click={onClickFn} tabindex="0" bind:this={element}>{data.value}</div>

{#if editable && showModal}
  <ConfigPopup x={element.offsetLeft + element.offsetWidth / 2} y={element.offsetTop} hasFeedback={true} bind:showModal on:removeTag id={id} on:selectChange={handleSelectChange}>

  </ConfigPopup>
{/if}

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
