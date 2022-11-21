<script lang="ts">
  import type { CollapseBlock } from '@mpa/db';
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import ExpandButtonEditor from '$lib/components/page/body/ExpandButtonEditor.svelte'

  export let attrs: CollapseBlock['attrs'];
  export let controls: SvelteNodeViewControls;
  export var rootDOM: (node: HTMLElement) => void;

  let expanded = false;
</script>

<div use:rootDOM contenteditable="false">
  <ExpandButtonEditor bind:content="{attrs.showmore}" on:complete={() => (expanded = false)} {controls} />
</div>

<style lang="stylus">
  :global(.svelte-node-view--cards.ProseMirror-selectednode .cards) {
    filter: brightness(98%);
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.20);
    outline: 1px solid #33333333;
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