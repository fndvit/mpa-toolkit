<script lang="ts">
  import Cards from "$lib/components/Cards/Cards.svelte";
  import type { CardData } from "$lib/components/Cards/Cards.svelte";
  import type { SvelteNodeViewControls } from "$lib/editor/svelte-nodeview";

  export let attrs: {cards: CardData[]};
  export let controls: SvelteNodeViewControls;

  $: if(attrs.cards.length === 0) controls.delete();

</script>

<Cards bind:cards={attrs.cards} editable />

<style>
  :global(.svelte-node-view--cards.ProseMirror-selectednode .cards) {
    filter: brightness(98%);
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.20);
    outline: 1px solid #33333333;
  }
</style>
