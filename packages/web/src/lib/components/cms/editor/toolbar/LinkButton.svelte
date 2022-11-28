<script lang="ts">
  import type { EditorState } from 'prosemirror-state';
  import type { EditorView } from 'prosemirror-view';
  import { getContext } from 'svelte';
  import { getTextNodeAtPos, isMarkActive } from '../helpers';
  import { IconButton } from '$lib/components/generic';
  import { schema } from '$lib/editor/schema';

  export let editorState: EditorState;
  export let text: string = null;

  const view = getContext('editorView') as EditorView;

  function onClick() {
    const { from, to } = editorState.selection;
    if (active) {
      const info = from === to ? getTextNodeAtPos(view, from) : { from, to };
      const tr = view.state.tr.removeMark(info.from, info.to, schema.marks.link);
      view.dispatch(tr);
    } else {
      const mark = schema.marks.link.create({ href: '' });
      const tr = view.state.tr.addMark(from, to, mark);
      view.dispatch(tr);
    }
  }

  $: active = isMarkActive(editorState, schema.marks.link);
</script>

<IconButton on:click={onClick} icon="link" {text} {active} theme="toolbar" />
