<script lang="ts">
  import { ExpandButtonBase, MiniProsemirrorEditor } from '$lib/components';

  export let content: string;
</script>

<ExpandButtonBase expanded={false} on:click>
  <MiniProsemirrorEditor bind:content on:complete placeholder="Show more on this topic..." />
</ExpandButtonBase>
