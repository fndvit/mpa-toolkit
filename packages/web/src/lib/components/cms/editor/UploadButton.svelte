<script lang="ts">
  import type { EditorView } from 'prosemirror-view';
  import { getContext } from 'svelte';
  import * as api from '$lib/api';
  import { IconButton } from '$lib/components';
  import { findPlaceholder, placeholderPlugin } from '$lib/editor/placeholder';
  import { schema } from '$lib/editor/schema';

  export let title: string;

  let inputEl: HTMLInputElement;

  const view = getContext('editorView') as EditorView;

  const onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = () => {
    inputEl.click();
  };

  async function startImageUpload(view: EditorView, file: File) {
    let key = {};
    let tr = view.state.tr;
    if (!tr.selection.empty) tr.deleteSelection();
    tr.setMeta(placeholderPlugin, { add: { key, pos: tr.selection.from } });
    view.dispatch(tr);

    try {
      const url = await api.image.upload(file);
      let pos = findPlaceholder(view.state, key);
      if (pos == null) return;
      view.dispatch(
        view.state.tr
          .replaceWith(pos, pos, schema.nodes.image.create({ src: url }))
          .setMeta(placeholderPlugin, { remove: { key } })
      );
    } catch (err) {
      view.dispatch(tr.setMeta(placeholderPlugin, { remove: { key } }));
    }
  }

  const onChangeFile: svelte.JSX.ChangeEventHandler<HTMLInputElement> = e => {
    const { files } = e.currentTarget;
    if (view.state.selection.$from.parent.inlineContent && files.length) {
      startImageUpload(view, files[0]);
    }
    view.focus();
  };
</script>

<IconButton on:click={onClick} icon="image" {title} />

<input bind:this={inputEl} style="display: none;" type="file" on:change={onChangeFile} accept=".jpg,.png" />
