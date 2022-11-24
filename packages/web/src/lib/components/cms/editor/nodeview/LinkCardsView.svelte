<script lang="ts">
  import type { LinkCardsBlock } from '@mpa/db';
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import { LinkCards } from '$lib/components/shared';

  export let attrs: LinkCardsBlock['attrs'];
  export let controls: SvelteNodeViewControls;
  export let rootDOM: (node: HTMLElement) => void;
</script>

<div use:rootDOM contenteditable="false">
  <LinkCards bind:cards={attrs.cards} bind:title={attrs.title} editable {controls}/>
</div>

<style lang="stylus">
  :global(.svelte-node-view--link-cards.ProseMirror-selectednode .link-cards) {
    filter: brightness(98%);
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.20);
    outline: 1px solid #33333333;
  }
</style>
