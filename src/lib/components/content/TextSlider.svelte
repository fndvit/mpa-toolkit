<script lang="ts">
  import type { CardsBlock } from '$lib/types';
  import Cards from '../Cards/Cards.svelte';

  export let block: CardsBlock;

  const cards = block.content.map(({content}) => ({
    heading: content[0].content.map(b => b.text).join(''),
    body: content[1].content.map(b => b.text).join(''),
  }));

</script>

<Cards {cards} />