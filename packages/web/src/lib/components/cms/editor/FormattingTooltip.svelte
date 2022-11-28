<script lang="ts">
  import type { EditorState } from 'prosemirror-state';
  import { createPopper, type Instance } from '@popperjs/core';
  import { tick } from 'svelte';
  import { debounce } from '@mpa/utils';
  import MarkButton from './toolbar/MarkButton.svelte';
  import LinkButton from './toolbar/LinkButton.svelte';
  import { schema } from '$lib/editor/schema';

  export let editorState: EditorState;

  let tooltipEl: HTMLElement;
  let lastState: EditorState;
  let show = false;
  let tooltip: { popper: Instance };

  const showPopper = debounce(() => {
    tooltip = {
      popper: createPopper({ getBoundingClientRect }, tooltipEl, {
        placement: 'bottom',
        onFirstUpdate: () => (tooltipEl.style.opacity = '1'),
        modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
      })
    };
  }, 500);

  const destroy = () => {
    showPopper.cancel();
    if (tooltip) {
      tooltip.popper.destroy();
      tooltip = null;
    }
  };

  const getBoundingClientRect = (): DOMRect => {
    const containingRect = (r1: DOMRect, r2: DOMRect) => {
      const left = Math.min(r1.left, r2.left);
      const top = Math.min(r1.top, r2.top);
      const right = Math.max(r1.right, r2.right);
      const bottom = Math.max(r1.bottom, r2.bottom);
      const rect = { left, top, right, bottom, width: right - left, height: bottom - top, x: left, y: top };
      return {
        ...rect,
        toJSON: () => rect
      };
    };

    return [...document.getSelection().getRangeAt(0).getClientRects()].reduce(containingRect);
  };

  const update = async (state: EditorState) => {
    const changed = !lastState || !lastState.selection.eq(state.selection);
    lastState = state;
    if (!changed) return;
    show = !state.selection.empty;
    if (!show) return destroy();

    if (show) {
      await tick();
      if (tooltip) {
        tooltip.popper.update();
      } else {
        showPopper();
      }
    }
    lastState = state;
  };

  $: update(editorState);
</script>

{#if show}
  <div bind:this={tooltipEl} class="formatting-tooltip" class:formatting-tooltip--show={show} role="tooltip">
    <MarkButton {editorState} markType={schema.marks.strong} icon="format_bold" />
    <MarkButton {editorState} markType={schema.marks.em} icon="format_italic" />
    <LinkButton {editorState} />
  </div>
{/if}

<style lang="postcss">
  .formatting-tooltip {
    user-select: none;
    font: $f-ui;
    color: #333;
    padding: 0.2rem;
    column-gap: 0.2rem;
    background: $c-neutral-bg;
    border-radius: 4px;
    z-index: $z-tooltip;
    position: absolute;
    max-width: 200px;
    text-align: center;
    filter: drop-shadow(0 0 5px rgb(0 0 0 / 20%));
    opacity: 0;
    display: flex;

    > :global(*) {
      user-select: none;
    }
  }

  .testbox {
    position: absolute;
    background: rgb(0 0 0 / 10%);
    border: 1px solid rgb(0 0 0 / 20%);
    z-index: 100;
  }
</style>
