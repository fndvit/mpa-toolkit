<script lang="ts">
  import type { EditorView } from "prosemirror-view";

  import MiniProsemirrorEditor from "../cms/editor/MiniProsemirrorEditor.svelte";
  import ExpandButtonBase from "./ExpandButtonBase.svelte";

  export let content: string;
  export let view: EditorView = undefined;
</script>

<ExpandButtonBase expanded={false} on:click>
  <MiniProsemirrorEditor
    bind:content
    bind:view
    on:complete
    placeholder="Show more on this topic..."
  />
</ExpandButtonBase>
