<script lang="ts">
  import type { CardsBlock } from '$lib/types';
  import Cards from '$lib/components/Cards/Cards.svelte';

  export let block: CardsBlock;

</script>

<Cards cards={block.attrs.cards} />
