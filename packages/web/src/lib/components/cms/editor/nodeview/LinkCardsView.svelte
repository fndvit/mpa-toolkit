<script lang="ts">
  import type { LinkCardsBlock } from '@mpa/db';
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import { LinkCards } from '$lib/components/shared';

  export let attrs: LinkCardsBlock['attrs'];
  export let controls: SvelteNodeViewControls;
  export let rootDOM: (node: HTMLElement) => void;
</script>

<div use:rootDOM contenteditable="false">
  <LinkCards bind:cards={attrs.cards} bind:title={attrs.title} editable {controls} />
</div>

<style lang="postcss">
  :global(.svelte-node-view--link-cards.ProseMirror-selectednode .link-cards) {
    filter: brightness(98%);
    box-shadow: 0 3px 16px rgb(0 0 0 / 20%);
    outline: 1px solid #3333;
  }

  div:hover {
    position: relative;
    z-index: 1;
  }
</style>
