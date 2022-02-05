<script lang="ts">
  import { toggleMark } from 'prosemirror-commands';
  import type { MarkType } from 'prosemirror-model';
  import type { EditorState, Transaction } from 'prosemirror-state';
  import MenuButton from './MenuButton.svelte';

  export let editorState: EditorState;
  export let dispatchTransaction: (tr: Transaction) => void;
  export let markType: MarkType;
  export let icon: string = null;
  export let text: string = null;

  const toggle = toggleMark(markType, { title: 'Bold' });

  function onClick() {
    toggle(editorState, dispatchTransaction);
  }


  function markActive(state: EditorState, type) {
    let {from, to, empty} = state.selection
    if (empty) return type.isInSet(state.storedMarks || state.selection.$from.marks())
    else return state.doc.rangeHasMark(from, to, type)
  }

  $: active = markActive(editorState, markType);

</script>

<MenuButton on:click={onClick} {icon} {text} {active} />
