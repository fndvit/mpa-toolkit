<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import MilestoneTextEditor from "./content/MilestoneTextEditor.svelte";
  import IconButton from "./IconButton.svelte";

  export let year: string;
  export let content: string[];
  export let editor = false;

  const dispatch = createEventDispatcher<{saveYear: string, delete: null}>();

  let contracted = new Array<boolean>(content.length).fill(!editor);
  let editIndex: number;
  let editYear: string = editor && year === '' ? '' : undefined;

  function onClickAdd() {
    content.push('');
    content = content;
    editIndex = content.length - 1;
  }

  function onClickMilestone(i: number) {
    if (editor) {
      editIndex = editor && i;
    } else {
      contracted[i] = !contracted[i];
    }
  }

  const onClickSaveYear: svelte.JSX.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    dispatch('saveYear', editYear);
    editYear = undefined;
  }

  function onSaveText(i: number, text: string) {
    content[i] = text;
    editIndex = null;
  }

  function onDeleteMilestone(i: number) {
    content.splice(i, 1);
    editIndex = undefined;
    content = content;
  }

  function onClickDeleteYear() {
    dispatch('delete');
  }

  $: simple = content.length <= 1;
</script>

<div class="container">

  <div class="year">
    {#if editYear === undefined}
      <span on:click={() => editYear = year}>{year}</span>
    {:else}
      <input type="number" bind:value={editYear} />
      <IconButton icon='done' on:click={onClickSaveYear} disabled={!editYear} />
      {#if year}
        <IconButton icon='close' on:click={() => editYear = undefined} disabled={!editYear} />
      {/if}
    {/if}
    {#if editor}
      <IconButton icon="delete" on:click={onClickDeleteYear} />
    {/if}

  </div>

  <svg class="main-circle" height="15" width="15">
    <circle cx="7.5" cy="7.5" r="5" />
  </svg>

  {#if simple}

    <div class="milestone-text simple" on:click={() => onClickMilestone(0)}>
      {#if editIndex === 0}
        <MilestoneTextEditor
          text={content[0]}
          on:save={({detail}) => onSaveText(0, detail)}
          on:cancel={() => editIndex = undefined}
        />
      {:else}
        <span>{content[0]}</span>
      {/if}
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
            {#if editIndex === i}
              <MilestoneTextEditor
                text={content[i]}
                on:save={({detail}) => onSaveText(i, detail)}
                on:cancel={() => editIndex = undefined}
                on:delete={() => onDeleteMilestone(i)}
              />
            {:else}
              <span>{text}</span>
            {/if}
          </div>

        </div>
      {/each}

      <div class="main-line" style="--num-milestones: {content.length - 1}" />
    </div>

  {/if}

  {#if editor}
    <div class="add-button">
      <IconButton on:click={onClickAdd} icon="add" />
    </div>
  {/if}
</div>

<style lang="scss">

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
    width: 200px;
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

    > span {
      display: block;
      max-width: 200px;
    }

    &.simple {
      padding-top: 28px;
      padding-left: 3px;
    }

    &.contracted {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding-left: 22px;
      padding-top: 0px;
      color: #FBE26B;
    }

  }

  span {
    font-weight: 500;
    color: #F9F9F9;
  }


  .year {
    display: flex;
    column-gap: 5px;
    align-items: center;
    font-size: 12px;
    color: #F9F9F9;
    height: 25px;
    padding-left: 4px;
    > :global(button) {
      --color: white;
      --size: 1.2rem;
    }
    span {
      display: block;
    }
    input {
      width: 60px;
    }
  }

  .container {
    :global(.icon-button) {
      --color: white;
      --size: 1.4rem;
      --bg-color: #00000022;
      --hover-border-color: #00000033;
      --hover-bg: #ffffff55;
    }
    :global(.icon-button:disabled) {
      --bg-color: #77777755;
      --color: #ffffff55
    }
  }

  .add-button {
    max-width: 200px;
    margin-top: 10px;

    :global(.icon-button) {
      margin: auto;
      --size: 2rem;
      --font-size: 1.4rem;
    }
  }

</style>