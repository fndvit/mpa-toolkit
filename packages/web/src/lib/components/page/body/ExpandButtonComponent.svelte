<script lang="ts">
  import type { CollapseBlock } from '@mpa/db';
  import ExpandButton from './ExpandButton.svelte';

  export let block: CollapseBlock;
</script>

<ExpandButton content={block.attrs.showmore} expanded={false} collapsePoint={true} />