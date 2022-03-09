<script lang="ts">
  import { setBlockType } from 'prosemirror-commands';
  import type { NodeType } from 'prosemirror-model';
  import type { EditorState, Transaction } from 'prosemirror-state';
  import MenuButton from './MenuButton.svelte';

  export let editorState: EditorState;
  export let dispatchTransaction: (tr: Transaction) => void;
  export let nodeType: NodeType;
  export let attrs: {} = null;
  export let icon: string = null;
  export let text: string = null;

  const run = setBlockType(nodeType, attrs);
  const onClick = () => run(editorState, dispatchTransaction);

  const isActive = (state: EditorState) => {
    const node = editorState.selection.$head.node();
    const sameNode = node.type === nodeType;
    if (!sameNode) return false;
    for (const key in attrs) {
      if (attrs[key] !== node.attrs[key]) return false;
    }
    return true;
  }

  $: active = isActive(editorState);
</script>

<MenuButton on:click={onClick} {icon} {text} {active} />
