<script lang="ts">
  import MiniProsemirrorEditor from "../cms/editor/MiniProsemirrorEditor.svelte";
  import ExpandButtonBase from "./ExpandButtonBase.svelte";

  export let content: string;
</script>

<ExpandButtonBase expanded={false} on:click>
  <MiniProsemirrorEditor
    bind:content
    on:complete
    placeholder="Show more on this topic..."
  />
</ExpandButtonBase>
