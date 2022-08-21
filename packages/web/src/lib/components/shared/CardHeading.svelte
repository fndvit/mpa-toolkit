<script lang="ts">
  import { EditableText } from '$lib/components';
  export let text: string;
  export let editable = false;
</script>

<div class="heading">
  <EditableText bind:value={text} {editable} placeholder="Heading..." />
</div>

<style lang="stylus">
  .heading {
    typography: h4-responsive;
    margin-top: 5px;
  }
</style>
