<script lang="ts">
  import ExpandButtonBase from './ExpandButtonBase.svelte';
  import MiniProsemirrorEditor from '$lib/components/cms/editor/MiniProsemirrorEditor.svelte';

  export let content: string;
</script>

<ExpandButtonBase expanded={false} on:click>
  <MiniProsemirrorEditor bind:content on:complete placeholder="Show more on this topic..." />
</ExpandButtonBase>
