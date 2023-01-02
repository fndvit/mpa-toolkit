<script lang="ts">
  import type { CollapseBlock } from '@mpa/db';
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import ExpandButtonEditor from '$lib/components/page/body/ExpandButtonEditor.svelte';

  export let attrs: CollapseBlock['attrs'];
  export let controls: SvelteNodeViewControls;
  export var rootDOM: (node: HTMLElement) => void;

</script>

<div use:rootDOM contenteditable="false">
  <ExpandButtonEditor bind:content={attrs.showmore} {controls} />
</div>

<style lang="postcss">
  :global(.svelte-node-view--cards.ProseMirror-selectednode .cards) {
    filter: brightness(98%);
    box-shadow: 0 3px 16px rgb(0 0 0 / 20%);
    outline: 1px solid #3333;
  }

  :global(.mini-editor *) {
    font-size: 12px !important;
    margin: 0;
  }

  :global(.mini-editor) {
    min-width: 200px;
    outline: none;
    height: 40px;
    display: flex;
    align-items: center;
  }
</style>
