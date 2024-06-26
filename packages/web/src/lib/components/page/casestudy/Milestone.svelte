<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { EditableText, IconButton } from '$lib/components/generic';

  export let year: string;
  export let content: string[];
  export let editable = false;

  let editYear = year;
  let yearFocused = false;
  let editableYear: EditableText;

  const dispatch = createEventDispatcher<{ saveYear: string; delete: null }>();

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

<div class="milestone" class:simple>
  <div class="year">
    <EditableText
      bind:this={editableYear}
      bind:value={editYear}
      {editable}
      placeholder="year"
      bind:focused={yearFocused}
    />
    {#if editable}
      {#if !year || yearFocused}
        <IconButton icon="done" on:click={onClickSaveYear} disabled={!editYear} />
        {#if year}
          <IconButton icon="close" on:click={onClickCancelYear} disabled={!editYear} />
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
      <EditableText bind:value={content[0]} {editable} />
    </div>
  {:else}
    <div class="milestones-block">
      {#each content as _, i}
        <div class="milestone-item" on:click={() => onClickMilestone(i)} style={`--row: ${i + 1};`}>
          <svg class="sub-thread-line" width="10" height="4" viewBox="0 0 10 4">
            <path d="M1.22933 0.955129V0.955129C2.81493 2.54068 5.01818 3.34773 7.25278 3.1615L9.729 2.95514" />
          </svg>

          {#if contracted[i]}
            <svg class="expandable-circle" width="17" height="17" viewBox="0 0 17 17">
              <circle cx="8.5" cy="8.5" r="5" />
              <line x1="14" y1="0.5" x2="17" y2="0.5" />
              <line x1="16.5" y1="3" x2="16.5" y2="1" />
              <line x1="3" y1="16.5" x2="4.37114e-08" y2="16.5" />
              <line x1="0.5" y1="14" x2="0.5" y2="16" />
            </svg>
          {:else}
            <svg class="milestone-circle" class:expanded={!contracted[i]} height="15" width="15">
              <circle cx="7.5" cy="7.5" r="5" />
            </svg>
          {/if}

          <div class="milestone-text" class:contracted={contracted[i]}>
            <EditableText bind:value={content[i]} {editable} />
          </div>

          {#if editable}
            <div class="delete-milestone-button">
              <IconButton icon="close" on:click={() => onDeleteMilestone(i)} />
            </div>
          {/if}
        </div>
      {/each}

      <div class="main-line" style={`--num-milestones: ${content.length - 1}`} />
    </div>
  {/if}

  {#if editable}
    <div class="add-button">
      <IconButton on:click={onClickAdd} icon="add" text="Add milestone" />
    </div>
  {/if}
</div>

<style lang="postcss">
  .milestone {
    :global(.icon-button) {
      --ib-color: white;
      --ib-size: 1.4rem;
      --ib-hover-bg: #0005;
    }

    :global(.editable-content:empty) {
      background: #fff3;
      border-radius: 4px;
    }
  }

  .main-circle {
    position: absolute;
    stroke: $c-highlight-1;
    stroke-width: 3;
    fill: $c-primary-blue;
  }

  .milestones-block {
    display: grid;
  }

  .main-line {
    pointer-events: none;
    border-left: 1.5px dashed $c-highlight-1;
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
      stroke: $c-highlight-1;
      stroke-width: 1.5px;
      fill: none;
    }
  }

  .milestone-item {
    grid-column: 1;
    grid-row: var(--row);
    padding: 40px 0 0;
    cursor: pointer;
    position: relative;
    max-width: 100%;
    overflow: hidden;
  }

  .milestone-circle {
    transform: translate(17px, -6px);
    stroke: $c-highlight-1;
    stroke-width: 3;
    fill: $c-primary-blue;

    &.expanded {
      fill: $c-highlight-1;
    }
  }

  .expandable-circle {
    stroke: $c-highlight-1;
    transform: translate(16px, -7px);

    circle {
      fill: $c-primary-blue;
      stroke-width: 3px;
    }
  }

  .milestone-text {
    @mixin font-responsive p-graphic;

    color: $c-neutral-bg;
    padding-top: 1.5px;
    padding-left: 22px;

    .simple & {
      padding-top: 28px;
      padding-left: 3px;
    }

    &.contracted {
      padding-left: 22px;
      padding-top: 0;

      :global(.editable-content) {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .year {
    font: $f-ui-small;
    display: flex;
    column-gap: 5px;
    align-items: center;
    color: $c-neutral-bg;
    height: 25px;
    padding-left: 2px;

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
      --ib-color: #fffe;
      --ib-hover-bg: #0001;
      --ib-size: 1.5rem;

      opacity: 0.75;
    }
  }

  :global(.splide__slide:hover) .milestone :global(.editable-content-container:not(.empty) [contenteditable]) {
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
