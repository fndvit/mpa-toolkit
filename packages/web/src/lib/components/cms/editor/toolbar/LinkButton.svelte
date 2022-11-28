<script lang="ts">
  import type { EditorState } from 'prosemirror-state';
  import type { EditorView } from 'prosemirror-view';
  import { getContext } from 'svelte';
  import { isMarkActive } from '../helpers';
  import { IconButton } from '$lib/components/generic';
  import { schema } from '$lib/editor/schema';

  export let editorState: EditorState;
  export let text: string = null;

  const view = getContext('editorView') as EditorView;

  const getTextNodeAtPos = (pos: number) => {
    const node = view.state.doc.nodeAt(pos);
    if (node && node.isText) {
      const resolved = view.state.doc.resolve(pos);
      const from = pos - resolved.textOffset;
      const to = from + node.nodeSize;
      return { node, from, to };
    }
  };

  function onClick() {
    const { from, to } = editorState.selection;
    if (active) {
      const info = from === to ? getTextNodeAtPos(from) : { from, to };
      const tr = editorState.tr.removeMark(info.from, info.to, schema.marks.link);
      view.dispatch(tr);
    } else {
      const mark = schema.marks.link.create({ href: '' });
      const tr = editorState.tr.addMark(from, to, mark);
      view.dispatch(tr);
    }
  }

  $: active = isMarkActive(editorState, schema.marks.link);
</script>

<IconButton on:click={onClick} icon="link" {text} {active} theme="toolbar" />
