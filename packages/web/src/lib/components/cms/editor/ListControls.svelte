<script lang="ts">
  import { range } from '@mpa/utils';
  import { autoJoin } from 'prosemirror-commands';
  import { liftListItem, sinkListItem, wrapInList } from 'prosemirror-schema-list';
  import type { Command, EditorState } from 'prosemirror-state';
  import type { EditorView } from 'prosemirror-view';
  import { getContext } from 'svelte';
  import { isListNode } from './helpers';
  import { schema } from '$lib/editor/schema';
  import { IconButton } from '$lib/components';

  export let editorState: EditorState;

  const view = getContext('editorView') as EditorView;

  export function getListMetadata(state: EditorState) {
    const { $from } = state.selection;
    const listDepths = range(0, $from.depth).filter(i => isListNode($from.node(i).type));
    const depthOfContainingList = Math.max(...listDepths);
    return {
      numNestedLists: listDepths.length,
      hasPrevSibling: depthOfContainingList && $from.index(depthOfContainingList) > 0
    };
  }

  const execCmd = (cmd: Command) => cmd(editorState, view.dispatch);

  const createBulletList = () => execCmd(autoJoin(wrapInList(schema.nodes.bullet_list), ['bullet_list']));
  const createOrderedList = () => execCmd(autoJoin(wrapInList(schema.nodes.ordered_list), ['ordered_list']));
  const decreaseIndent = () => execCmd(liftListItem(schema.nodes.list_item));
  const increaseIndent = () => execCmd(sinkListItem(schema.nodes.list_item));

  $: metadata = getListMetadata(editorState);
  $: canIndent = metadata.hasPrevSibling;
  $: canLift = metadata.numNestedLists > 0;
</script>

{#if metadata.numNestedLists === 0}
  <IconButton on:click={createBulletList} icon="format_list_bulleted" title="Bullet list" />
  <IconButton on:click={createOrderedList} icon="format_list_numbered" title="Numbered list" />
{:else if metadata.numNestedLists > 0}
  <IconButton disabled={!canLift} on:click={decreaseIndent} icon="format_indent_decrease" title="Decrease indent" />
  <IconButton disabled={!canIndent} on:click={increaseIndent} icon="format_indent_increase" title="Indent" />
{/if}
