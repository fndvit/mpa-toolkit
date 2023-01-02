<script lang="ts">
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import type { DiagramBlock } from '@mpa/db';
  import Diagram from '$lib/components/page/body/Diagram.svelte';

  export let attrs: DiagramBlock['attrs'];
  export let controls: SvelteNodeViewControls;
  export let rootDOM: (node: HTMLElement) => void;
</script>

<div use:rootDOM contenteditable="false" class="diagram-view">
  <Diagram bind:diagram={attrs} editable {controls} />
</div>

<style lang="postcss">
  :global(.svelte-node-view--cards.ProseMirror-selectednode .diagram-view) {
    filter: brightness(98%);
    box-shadow: 0 3px 16px rgb(0 0 0 / 20%);
    outline: 1px solid #3333;
  }

  .diagram-view {
    width: fit-content;
  }
</style>
