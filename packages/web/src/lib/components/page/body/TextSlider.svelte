<script lang="ts">
  import type { CardsBlock } from '@mpa/db';
  import Cards from '$lib/components/shared/Cards.svelte';
  export let block: CardsBlock;
</script>

<Cards isContent={true} cards={block.attrs.cards} style={block.attrs.style} />
