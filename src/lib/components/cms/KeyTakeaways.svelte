<script lang="ts">
  import Button from "../Button.svelte";
  import Cards from "../Cards/Cards.svelte";
import IconButton from "../IconButton.svelte";

  export let keyTakeaways: string[] = [];
  export let editable = false;

  let cards = keyTakeaways.map(text => ({
    heading: 'Key takeaways',
    body: text,
  }));

  $: keyTakeaways = cards.map(c => c.body);

  const onClickAdd = () => {
    cards.push({ heading: 'Key takeaways', body: '' });
    cards = cards;
  };

</script>

{#if keyTakeaways.length}
  <div class="key-takeaways">
    <Cards bind:cards {editable} fixedTitle="Key takeaways" />
  </div>
{:else if editable}
  <div class="add-key-takeaways">
    <IconButton icon="add" on:click={onClickAdd} text="Add Key takeaways" />
  </div>
{/if}

<style lang="scss">
  .key-takeaways {
    max-width: 850px;
    margin-bottom: 25px;
    margin-left: -30px;
    --ec-hover-bg: #ffffff44;
    :global(.button) {
      margin: auto;
    }
  }
  .add-key-takeaways {
    margin-bottom: -10px;
    --icon-color: #ffffffee;
    --hover-border: 1px solid transparent;
    --hover-bg: #00000011;
  }

</style>