<script lang="ts">
  import { toggleMark } from 'prosemirror-commands';
  import type { MarkType } from 'prosemirror-model';
  import type { EditorState } from 'prosemirror-state';
  import type { EditorView } from 'prosemirror-view';
  import { getContext } from 'svelte';
  import { isMarkActive } from '../helpers';
  import { IconButton } from '$lib/components/generic';

  export let editorState: EditorState;
  export let markType: MarkType;
  export let icon: string = null;
  export let text: string = null;

  const toggle = toggleMark(markType, { title: 'Bold' });

  const view = getContext('editorView') as EditorView;

  function onClick() {
    toggle(editorState, view.dispatch);
  }

  $: active = isMarkActive(editorState, markType);
</script>

<IconButton on:click={onClick} {icon} {text} {active} theme="toolbar" />
