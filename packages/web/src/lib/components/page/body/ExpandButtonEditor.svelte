<script lang="ts">
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import ExpandButtonBase from './ExpandButtonBase.svelte';
  import MiniProsemirrorEditor from '$lib/components/cms/editor/MiniProsemirrorEditor.svelte';
  import { IconButton } from '$lib/components/generic';

  export let content: string;
  export let controls: SvelteNodeViewControls = undefined;
</script>

<ExpandButtonBase expanded={false} on:click>
  <div class="icons">
    <IconButton icon="delete" on:click={controls.delete} />
  </div>
  <MiniProsemirrorEditor bind:content on:complete placeholder="Show more on this topic..." />
</ExpandButtonBase>

<style lang="postcss">
  .icons {
    --ib-icon-size: 1.5rem;
    --ib-color: #aaa;
    --ib-hover-filter: brightness(90%);

    position: absolute;
    margin-top: 0.15em;
    left: -40px;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
  }
</style>
