<script lang="ts">
  import { uploadImage } from "$lib/api";
  import IconButton from "$lib/components/IconButton.svelte";
  import type { EditorView } from "prosemirror-view";
  import { getContext } from "svelte";
  import { findPlaceholder, placeholderPlugin } from "./placeholder";
  import { schema } from "./schema";

  let inputEl: HTMLInputElement;

  const view = getContext("editorView") as EditorView;

  const onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = e => {
    inputEl.click();
  };

  async function startImageUpload(view: EditorView, file: File) {
    let id = {};
    let tr = view.state.tr;
    if (!tr.selection.empty) tr.deleteSelection()
    tr.setMeta(placeholderPlugin, {add: {id, pos: tr.selection.from}})
    view.dispatch(tr)

    try {
      const url = await uploadImage(file);
      let pos = findPlaceholder(view.state, id)
      if (pos == null) return
      view.dispatch(
        view.state.tr
          .replaceWith(pos, pos, schema.nodes.image.create({src: url}))
          .setMeta(placeholderPlugin, {remove: {id}})
      )
    }
    catch (err) {
      view.dispatch(tr.setMeta(placeholderPlugin, {remove: {id}}))
    }
  }

  const onChangeFile: svelte.JSX.ChangeEventHandler<HTMLInputElement> = e => {
    const { files } = e.currentTarget;
    if (view.state.selection.$from.parent.inlineContent && files.length) {
      startImageUpload(view, files[0])

    }
  view.focus()
  };

</script>


<IconButton on:click={onClick} icon="image" />

<input
  bind:this={inputEl}
  style="display: none;"
  type="file"
  on:change={onChangeFile}
  accept=".jpg,.png"
/>

