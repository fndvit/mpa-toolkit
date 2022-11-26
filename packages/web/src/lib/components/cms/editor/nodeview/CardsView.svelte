<script lang="ts">
  import type { CardsBlock } from '@mpa/db';
  import clone from 'clone';
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import { Cards } from '$lib/components/shared';

  export let attrs: CardsBlock['attrs'];
  export let controls: SvelteNodeViewControls;
  export let rootDOM: (node: HTMLElement) => void;

  let lastCards = clone(attrs.cards);

  $: {
    if (attrs.cards.length === 0) {
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
  <Cards bind:cards={attrs.cards} bind:cardStyle={attrs.style} editable />
</div>

<style lang="postcss">
  :global(.svelte-node-view--cards.ProseMirror-selectednode .cards) {
    filter: brightness(98%);
    box-shadow: 0 3px 16px rgb(0 0 0 / 20%);
    outline: 1px solid #3333;
  }
</style>
