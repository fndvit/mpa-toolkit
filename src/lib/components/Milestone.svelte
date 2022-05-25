<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import IconButton from "$lib/components/generic/IconButton.svelte";
  import EditableText from "./generic/EditableText.svelte";

  export let year: string;
  export let content: string[];
  export let editable = false;

  let editYear = year;
  let yearFocused = false;
  let editableYear: EditableText;

  const dispatch = createEventDispatcher<{saveYear: string, delete: null}>();

  let contracted = new Array<boolean>(content.length).fill(!editable);

  function onClickAdd() {
    content.push('');
    content = content;
  }

  function onClickMilestone(i: number) {
    if (!editable) {
      contracted[i] = !contracted[i];
    }
  }

  function onDeleteMilestone(i: number) {
    content.splice(i, 1);
    content = content;
  }

  function onClickDeleteYear() {
    dispatch('delete');
  }

  const onClickSaveYear: svelte.JSX.MouseEventHandler<HTMLElement> = () => {
    dispatch('saveYear', editYear);
    year = editYear;
    editableYear.blur();
  };

  const onClickCancelYear: svelte.JSX.MouseEventHandler<HTMLElement> = () => {
    editYear = year;
    editableYear.blur();
  };

  $: simple = content.length <= 1;
</script>

<div class="container" class:simple>

  <div class="year">
    <EditableText bind:this={editableYear} bind:value={editYear} {editable} placeholder="year" bind:focused={yearFocused}/>
    {#if editable}
      {#if !year || yearFocused}
        <IconButton icon='done' on:click={onClickSaveYear} disabled={!editYear} />
        {#if year}
          <IconButton icon='close' on:click={onClickCancelYear} disabled={!editYear} />
        {/if}
      {/if}
      <div class="delete-year-button">
        <IconButton icon="delete" on:click={onClickDeleteYear} />
      </div>
    {/if}
  </div>

  <svg class="main-circle" height="15" width="15">
    <circle cx="7.5" cy="7.5" r="5" />
  </svg>

  {#if simple}

    <div class="milestone-text" on:click={() => onClickMilestone(0)}>
      <EditableText bind:value={content[0]}  {editable} />
    </div>

  {:else}

    <div class="milestones-block">

      {#each content as text, i}
        <div class='milestone-container' on:click={() => onClickMilestone(i)} style="--row: {i+1};">

          <svg class="sub-thread-line" width="10" height="4" viewBox="0 0 10 4">
            <path d="M1.22933 0.955129V0.955129C2.81493 2.54068 5.01818 3.34773 7.25278 3.1615L9.729 2.95514"/>
          </svg>

          {#if contracted[i]}
            <svg class="expandable-circle" width="17" height="17" viewBox="0 0 17 17">
              <circle cx="8.5" cy="8.5" r="5"  />
              <line x1="14" y1="0.5" x2="17" y2="0.5" />
              <line x1="16.5" y1="3" x2="16.5" y2="1" />
              <line x1="3" y1="16.5" x2="4.37114e-08" y2="16.5" />
              <line x1="0.5" y1="14" x2="0.5" y2="16" />
            </svg>
          {:else}
            <svg class="milestone-circle" class:expanded={!contracted[i]} height="15" width="15">
              <circle cx="7.5" cy="7.5" r="5"/>
            </svg>
          {/if}

          <div class="milestone-text" class:contracted={contracted[i]}>
            <EditableText bind:value={content[i]}  {editable} />
          </div>

          {#if editable}
            <div class="delete-milestone-button">
              <IconButton icon='close' on:click={() => onDeleteMilestone(i)} />
              </div>
          {/if}

        </div>
      {/each}

      <div class="main-line" style="--num-milestones: {content.length - 1}" />
    </div>

  {/if}

  {#if editable}
    <div class="add-button">
      <IconButton on:click={onClickAdd} icon="add" text="Add milestone" />
    </div>
  {/if}
</div>

<style lang="scss">

  .container {
    --ms-width: 200px;

    :global(.icon-button) {
      --ib-color: white;
      --ib-size: 1.4rem;
      --ib-hover-bg: #00000055;
    }

    :global(.editable-content:empty) {
      background: #ffffff33;
      border-radius: 4px;
    }
  }

  .main-circle {
    position: absolute;
    stroke: #FBE26B;
    stroke-width: 3;
    fill: #096EAE;
  }

  .milestones-block {
    display: grid;
  }

  .main-line {
    pointer-events: none;
    border-left: 1.5px dashed #FBE26B;
    grid-column: 1;
    grid-row: 1 / span var(--num-milestones);
    margin-left: 7px;
    margin-top: 5px;
    height: 100%;
    box-sizing: content-box;
    padding-bottom: 34px;
  }

  .sub-thread-line {
    position: absolute;
    margin-left: 7px;
    path {
      stroke-dasharray: 3;
      stroke: #FBE26B;
      stroke-width: 1.5px;
      fill: none;
    }
  }

  .milestone-container {
    grid-column: 1;
    grid-row: var(--row);
    padding: 40px 0 0;
    cursor: pointer;
    position: relative;
    width: var(--ms-width);
  }

  .milestone-circle {
    transform: translate(17px, -6px);
    stroke: #FBE26B;
    stroke-width: 3;
    fill: #096EAE;
    &.expanded {
      fill: #FBE26B;
    }
  }

  .expandable-circle {
    stroke: #FBE26B;
    transform: translate(16px, -7px);

    circle {
      fill: #096EAE;
      stroke-width: 3px;
    }
  }

  .milestone-text {
    font-size: 16px;
    color: #F9F9F9;
    padding-top: 1.5px;
    padding-left: 22px;

    .simple & {
      padding-top: 28px;
      padding-left: 3px;
      width: var(--ms-width);
    }

    &.contracted {
      padding-left: 22px;
      padding-top: 0px;
      :global(.editable-content) {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

  }

  .year {
    display: flex;
    column-gap: 5px;
    align-items: center;
    font-size: 12px;
    color: #F9F9F9;
    height: 25px;
    padding-left: 4px;
    width: var(--ms-width);
    :global(input) {
      width: 40px;
    }
  }


  .delete-year-button,
  .delete-milestone-button,
  .add-button {
    :global(.splide__slide):not(:hover) & {
      visibility: hidden;
    }
  }

  .delete-year-button {
    flex: 1;
    display: flex;
    justify-content: right;
  }

  .add-button {
    max-width: 200px;
    margin-top: 15px;
    margin-left: 22px;

    .simple & {
      margin-left: 0;
    }

    :global(.icon-button) {
      --ib-color: #ffffffee;
      --ib-hover-bg: #00000011;
      --ib-size: 1.5rem;
      opacity: 0.75;
    }
  }

  :global(.splide__slide:hover) .container :global(.editable-content-container:not(.empty) [contenteditable]) {
    background: #ffffff10;
    border-radius: 4px;
  }

  .delete-milestone-button {
    position: absolute;
    top: 30px;
    left: 12px;

    :global(.icon-button) {
      --ib-hover-bg: #03395f;
      --ib-icon-bg: #034676;
    }
  }

</style>