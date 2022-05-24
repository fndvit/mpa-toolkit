<script lang="ts">
  import EditableContent from "$lib/components/generic/EditableContent.svelte";
  import InlineSvg from "../generic/InlineSvg.svelte";

  export let title: string;
  export let img: string;
  export let editable = false;

</script>

<div class="unep-logo">
  <InlineSvg svg="UNEP" />
</div>
<div class="splash" style="background-image: url({img});">
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
    background-size: cover;
    background-position: center center;
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
    width: 110px;
    color: white;
  }
</style>