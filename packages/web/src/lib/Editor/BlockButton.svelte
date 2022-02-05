<script lang="ts">
  import { setBlockType } from 'prosemirror-commands';
  import type { NodeType } from 'prosemirror-model';
  import type { EditorState, Transaction } from 'prosemirror-state';
  import MenuButton from './MenuButton.svelte';

  export let editorState: EditorState;
  export let dispatchTransaction: (tr: Transaction) => void;
  export let nodeType: NodeType;
  export let icon: string = null;
  export let text: string = null;

  const run = setBlockType(nodeType, { attrs: { level: 1 } });
  const onClick = () => run(editorState, dispatchTransaction);

  $: active = editorState.selection.$head.node().type === nodeType;
</script>

<MenuButton on:click={onClick} {icon} {text} {active} />
