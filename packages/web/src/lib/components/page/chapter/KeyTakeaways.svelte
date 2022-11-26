<script lang="ts">
  import { IconButton } from '$lib/components/generic';
  import { Cards } from '$lib/components/shared';

  export let keyTakeaways: string[] = [];
  export let editable = false;

  let cards = keyTakeaways.map(text => ({
    heading: 'Key takeaways',
    body: text
  }));

  $: keyTakeaways = cards.map(c => c.body);

  const onClickAdd = () => {
    cards.push({ heading: 'Key takeaways', body: '' });
    cards = cards;
  };
</script>

{#if keyTakeaways.length}
  <div class="key-takeaways">
    <Cards bind:cards {editable} canToggleHeading={false} fixedTitle="Key takeaways" />
  </div>
{:else if editable}
  <div class="add-key-takeaways">
    <IconButton icon="add" on:click={onClickAdd} text="Add Key takeaways" />
  </div>
{/if}

<style lang="postcss">
  .key-takeaways {
    --editable-hover-bg: #fff4;

    :global(.button) {
      margin: auto;
    }
  }

  .add-key-takeaways {
    margin-bottom: -10px;

    --ib-color: #fffe;
    --ib-hover-border: 1px solid transparent;
    --ib-hover-bg: #0001;
  }
</style>
