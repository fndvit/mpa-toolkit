<script lang="ts">
  import { slide } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { createEventDispatcher } from 'svelte';

  type K = $$Generic<string | number>;
  type T = $$Generic<{ [Key in K]: string | numeber }>;
  export let list: T[];
  export let key: K = undefined;

  const getKey = (item: T) => (key ? item[key] : list.indexOf(item));

  let isOver = false;
  const getDraggedParent = (node: HTMLElement) =>
    (node.dataset.index && node.dataset) || getDraggedParent(node.parentNode as HTMLElement);

  type Handler = svelte.JSX.DragEventHandler<HTMLLIElement>;

  let dragItemIndex: string;

  const start: Handler = e => (dragItemIndex = e.currentTarget.dataset.index);

  const over: Handler = e => {
    let dragged = getDraggedParent(e.currentTarget);
    if (isOver !== dragged.id) isOver = JSON.parse(dragged.id);
  };

  const leave: Handler = e => {
    let dragged = getDraggedParent(e.currentTarget);
    if (isOver === dragged.id) isOver = false;
  };

  const drop: Handler = e => {
    isOver = false;
    let to = getDraggedParent(e.currentTarget).index;
    let from = dragItemIndex;
    dragItemIndex = undefined;
    reorder({ from, to });
  };

  const dispatch = createEventDispatcher<{ sort: T[] }>();
  const reorder = ({ from, to }) => {
    let newList = [...list];
    newList[from] = [newList[to], (newList[to] = newList[from])][0];
    dispatch('sort', newList);
  };
</script>

{#if list && list.length}
  <ul>
    {#each list as item, index (getKey(item))}
      <li
        data-index={index}
        data-id={JSON.stringify(getKey(item))}
        draggable="true"
        on:dragstart={start}
        on:dragover|preventDefault={over}
        on:dragleave={leave}
        on:drop|preventDefault={drop}
        in:slide={{ duration: 250 }}
        animate:flip={{ duration: 300 }}
        class:over={getKey(item) === isOver}
      >
        <slot {item} {index}>
          <p>{getKey(item)}</p>
        </slot>
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    border: 2px dotted transparent;
    transition: border 0.1s linear;
  }

  .over {
    border-color: rgb(48 12 200 / 20%);
  }
</style>
