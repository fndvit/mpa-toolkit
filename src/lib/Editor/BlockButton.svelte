<script lang="ts">
  import IconButton from '$lib/components/IconButton.svelte';
  import { setBlockType } from 'prosemirror-commands';
  import type { NodeType } from 'prosemirror-model';
  import type { EditorState } from 'prosemirror-state';
  import type { EditorView } from 'prosemirror-view';
  import { getContext } from 'svelte';

  export let editorState: EditorState;
  export let nodeType: NodeType;
  export let attrs: {} = null;
  export let icon: string = null;
  export let text: string = null;

  const view = getContext('editorView') as EditorView;

  const run = setBlockType(nodeType, attrs);
  const onClick = () => run(editorState, view.dispatch);

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

<IconButton on:click={onClick} {icon} {text} {active} square />
