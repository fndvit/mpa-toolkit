<script lang="ts">
  import { staticUrl } from "$lib/helpers/content";
  import EditableContent from "../EditableContent.svelte";

  export let title: string;
  export let img: string;
  export let editable = false;

  const fallbackImg = '/static/chapter-preview-image.png';

</script>

<img class="unep-logo" src="/static/unep.svg" alt="unep-logo" />
<div class="splash" style="background-image: url({img ? staticUrl(img) : fallbackImg});">
  <h1>
    <EditableContent bind:value={title} {editable} placeholder="Page title" />
  </h1>
</div>

<style lang="scss">
  .splash {
    --ec-hover-bg: #ffffff22;
    min-height: 60vh;
    display: flex;
    align-items: flex-end;
    padding: 6rem;
    padding-bottom: 3rem;
    padding-left: 124px;
    h1 {
      max-width: 800px;
      width: 100%;
      color: white;
      text-shadow: 0px 2px 12px rgba(0, 0, 0, 0.45);
    }
  }

  .unep-logo {
    position: absolute;
    margin: 2rem;
  }
</style>