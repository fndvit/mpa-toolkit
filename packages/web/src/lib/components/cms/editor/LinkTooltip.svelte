<script lang="ts">
  import { createPopper, type Instance } from '@popperjs/core';
  import { tick } from 'svelte';
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import type { EditorView } from 'prosemirror-view';
  import type { LinkPlugin, SelectedLink } from './linkTooltip';
  import { schema } from '$lib/editor/schema';
  import type { EditorState } from 'prosemirror-state';
  import { getTextNodeAtPos, selectNode } from './helpers';

  export let editorState: EditorState;
  export let view: EditorView;
  export let plugin: LinkPlugin;

  let selected: SelectedLink;
  let tooltipEl: HTMLElement;
  let tooltip: { popper: Instance };
  let url: string;
  let lastVal: string;

  plugin.on('click', clickedLink => {
    if (clickedLink.node) {
      if ((!selected && clickedLink.node) || selected.node !== clickedLink.node) {
        // select if it's a node that wasn't selected
        selected = clickedLink;
      } else if (selected.node === clickedLink.node) {
        // deselect if it was selected already
        selected = null;
      }
    } else {
      // deselect if the click wasn't a link node
      selected = null;
    }
  });

  const destroy = () => {
    if (tooltip) {
      tooltip.popper.destroy();
      tooltip = null;
    }
  };

  const getBoundingClientRect = () => {
    const fromCoords = view.coordsAtPos(selected.from);
    const toCoords = view.coordsAtPos(selected.to);
    const left = Math.min(fromCoords.left, toCoords.left);
    const top = Math.min(fromCoords.top, toCoords.top);
    const right = Math.max(fromCoords.right, toCoords.right);
    const bottom = Math.max(fromCoords.bottom, toCoords.bottom);
    const rect = { left, top, right, bottom, width: right - left, height: bottom - top, x: left, y: top };
    return {
      ...rect,
      toJSON: () => rect
    };
  };

  const update = async (link: SelectedLink, prev: SelectedLink) => {
    if (!link) {
      if (prev) {
        const node = editorState.doc.nodeAt(prev.from);
        const isEmpty = node?.marks?.find(mark => mark.type === schema.marks.link)?.attrs?.href === '';
        if (isEmpty) {
          const tr = editorState.tr.removeMark(prev.from, prev.to, schema.marks.link);
          view.dispatch(tr);
        }
      }
      plugin.setDecoration(view, null);

      // prosemirror destroys the select when removing decorations
      // so this attempts to rectify it
      const { from, to } = editorState.selection;
      const textNode = getTextNodeAtPos(view, from);
      if (textNode && from >= textNode.from && to <= textNode.to) {
        if (from === to) {
          const { node, offset } = view.domAtPos(from);
          const selection = window.getSelection();
          selection.setPosition(node, offset);
        } else if (from === textNode.from && to === textNode.to) {
          selectNode(view.domAtPos(textNode.from + 1).node);
        }
      }
      return destroy();
    }

    plugin.setDecoration(view, link);
    url = lastVal = link.node?.marks?.find(m => m.type === schema.marks.link)?.attrs.href || '';
    await tick();

    tooltip = tooltip || {
      popper: createPopper({ getBoundingClientRect }, tooltipEl, {
        placement: 'bottom',
        onFirstUpdate: () => {
          const input = tooltipEl.querySelector('input');
          if (!input.hasAttribute(':focus')) {
            input.focus();
            input.select();
          }
        },
        modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
      })
    };
  };

  const onSubmit = async () => {
    const { from, to } = selected;
    const href = url;
    const tr = view.state.tr.addMark(from, to, schema.marks.link.create({ href }));
    view.dispatch(tr);

    await tick();
    selected = null;
  };

  const onClickDelete = async () => {
    const { from, to } = selected;
    selected = null;
    await tick();
    const tr = editorState.tr.removeMark(from, to, schema.marks.link);
    view.dispatch(tr);
  };

  const documentClickHandler = (e: Event) => {
    const target = e.target;
    if (target instanceof HTMLElement && view.dom.contains(target)) {
      const a = target.closest('a');
      if (a) e.preventDefault();
    }
  };

  let prevSelected: SelectedLink;

  $: if (prevSelected !== selected) {
    update(selected, prevSelected);
    prevSelected = selected;
  }
  $: dirty = url !== lastVal;
</script>

<svelte:window on:click|capture={documentClickHandler} />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={tooltipEl}
  class="link-tooltip"
  role="tooltip"
  on:click|stopPropagation
  class:link-tooltip--show={tooltip}
>
  <form on:submit|preventDefault={onSubmit}>
    <input type="url" bind:value={url} />
    <IconButton type="submit" icon="done" disabled={!dirty} theme="toolbar" />
  </form>
  <IconButton icon="delete" theme="toolbar" on:click={onClickDelete} />
</div>

<style lang="postcss">
  
  :global(.link-decoration) {
    background: #d0d2dc;
    outline: 1px solid #aaa;
  }

  .link-tooltip {
    user-select: none;
    font: $f-ui-small;
    color: #333;
    padding: 0.2rem;
    column-gap: 0.2rem;
    background: $c-neutral-bg;
    border-radius: 2px;
    z-index: $z-tooltip;
    position: absolute;
    text-align: center;
    filter: drop-shadow(0 0 10px rgb(0 0 0 / 20%));
    display: flex;
    outline: 1px solid #ccc;

    &:not(.link-tooltip--show) {
      visibility: hidden;
      pointer-events: none;
      position: absolute;
      top: 0;
    }

    form {
      display: contents;
    }

    &::before {
      display: flex;
      content: 'link';
      font-family: 'Material Icons';
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0.6rem;
      color: #999;
      pointer-events: none;
    }

    > :global(*) {
      user-select: none;
    }

    input {
      padding: 0 0.3rem 0 1.5rem;
      width: 300px;
      border: none;
      border-radius: 1px;
      line-height: 1.5;

      &:focus {
        outline: 2px solid #777;
      }
    }
  }
</style>
