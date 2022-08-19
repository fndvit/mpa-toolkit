<script lang="ts">
  import type { CardsBlock } from '@mpa/db';
  import { Cards } from '$lib/components';

  export let block: CardsBlock;
</script>

<Cards cards={block.attrs.cards} style={block.attrs.style} />
