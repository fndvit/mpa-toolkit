<script lang="ts">
  import type { LinkCardsBlock } from '@mpa/db';
  import LinkCards from '$lib/components/shared/LinkCards.svelte';
  export let block: LinkCardsBlock;
</script>

<LinkCards cards={block.attrs.cards} title={block.attrs.title}/>
