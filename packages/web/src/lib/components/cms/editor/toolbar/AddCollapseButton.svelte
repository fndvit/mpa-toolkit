<script lang="ts">
  import type { EditorState } from 'prosemirror-state';
  import { searchSiblings } from '../helpers';
  import { schema } from '$lib/editor/schema';
  import { createEmptyCollapse } from '$lib/helpers/content';
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import type { EditorView } from 'prosemirror-view';
  import { getContext } from 'svelte';

  export let editorState: EditorState;
  const view = getContext('editorView') as EditorView;

  const getExistingSectionCollapse = (state: EditorState) => {
    const startNode = state.doc.childAfter(state.selection.from);
    return searchSiblings({
      parent: state.doc,
      childIndex: startNode.index,
      dir: 'both',
      predicate: node => {
        if (node.type.name === 'collapse') return true;
        if (node.type.name === 'heading' && node.attrs.level === 1) return null; // break the search
      }
    });
  };

  $: disabled = !!getExistingSectionCollapse(editorState);

  const insertCollapse = () => {
    const newNode = schema.nodes.collapse.createAndFill(createEmptyCollapse());
    const tr = editorState.tr.replaceSelectionWith(newNode);
    view.dispatch(tr);
  };
</script>

<IconButton
  icon="expand"
  on:click={insertCollapse}
  {disabled}
  title={disabled ? 'Section already has a collapse point' : 'Add collapse section'}
/>
