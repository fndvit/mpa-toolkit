<script lang="ts">
  import type { MilestonesData } from "$lib/types";
  import Milestones from "../content/Milestones.svelte";

  export let milestones: MilestonesData = {};

</script>

<div class="milestone-editor">
  <Milestones bind:milestones editor />
</div>

<style lang="scss">
  .milestone-editor {
    overflow: hidden;
    grid-column: 1 / span 2;
    margin: 0 -20px;
    :global(.milestones) {
      --margin: 80px;
    }
  }

</style>