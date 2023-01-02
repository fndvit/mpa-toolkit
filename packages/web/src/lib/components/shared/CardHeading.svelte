<script lang="ts">
  import { EditableText } from '$lib/components/generic';
  export let text: string;
  export let editable = false;
</script>

<div class="heading">
  <EditableText bind:value={text} {editable} placeholder="Heading..." />
</div>

<style lang="postcss">
  .heading {
    @mixin font-responsive h4;

    margin-top: 5px;
  }
</style>
