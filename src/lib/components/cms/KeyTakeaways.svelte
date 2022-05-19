<script lang="ts">
  import Button from "../Button.svelte";
  import Cards from "../Cards/Cards.svelte";

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

{#if editable || keyTakeaways.length}
  <div class="key-takeaways">
    {#if keyTakeaways.length}
      <Cards bind:cards {editable} fixedTitle="Key takeaways" />
    {:else}
      <Button on:click={onClickAdd}>Add key takeaways</Button>
    {/if}
  </div>
{/if}

<style lang="scss">
  .key-takeaways {
    max-width: 850px;
    margin-bottom: 25px;
    margin-left: -30px;
    :global(.button) {
      margin: auto;
    }
  }

</style>