<script lang="ts">
  import type { CardsBlock } from "$lib/types";
  import type { SvelteNodeViewControls } from "prosemirror-svelte-nodeview";
  import Cards from "$lib/components/Cards/Cards.svelte";
  import clone from "clone";

  export let attrs: CardsBlock['attrs'];
  export let controls: SvelteNodeViewControls;
  export let rootDOM: (node: HTMLElement) => void;

  let lastCards = clone(attrs.cards);

  $: {
    if(attrs.cards.length === 0) {
      if (lastCards.length > 0) {
        attrs.cards = lastCards;
      }
      controls.delete();
    } else {
      lastCards = clone(attrs.cards);
    }
  }

</script>

<div use:rootDOM contenteditable="false">
  <Cards bind:cards={attrs.cards} bind:style={attrs.style} editable />
</div>

<style lang="stylus">
  :global(.svelte-node-view--cards.ProseMirror-selectednode .cards) {
    filter: brightness(98%);
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.20);
    outline: 1px solid #33333333;
  }
</style>
