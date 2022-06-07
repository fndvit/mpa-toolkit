<script lang="ts">
  import EditableText from "../generic/EditableText.svelte";
  export let text: string;
  export let editable = false;
</script>

<div class="heading">
  <EditableText bind:value={text} {editable} placeholder='Heading...' />
</div>

<style lang="scss">
  .heading {
    margin-top: 5px;
    font-size: 20px;
    font-weight: 700;
  }
</style>
