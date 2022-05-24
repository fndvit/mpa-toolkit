<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import IconButton from "$lib/components/generic/IconButton.svelte";
  import EditableNumber from "./EditableNumber.svelte";

  export let value: number;
  export let editable = true;

  const dispatch = createEventDispatcher<{save: number}>();

  let editValue = value;

  const onClick: svelte.JSX.MouseEventHandler<HTMLElement> = e => {
    e.stopPropagation();
    value = editValue;
    dispatch('save', value);
  };

</script>

{#if !editable}
  <div>{value}</div>
{:else}
  <EditableNumber bind:value={editValue} editable/>
  {#if editValue !== value}
    <IconButton icon='done' on:click={onClick} disabled={!editValue} />
    <IconButton icon='close' on:click={() => editValue = value} />
  {/if}
{/if}
