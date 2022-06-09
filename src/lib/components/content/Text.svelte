<script lang="ts">
  import type { TextBlock } from "$lib/types";
  export let block: TextBlock;

  const markClasses = block.marks ? block.marks.map(mark => `mark--${mark.type}`) : [];
</script>

<span class="{markClasses.join(' ')}">{block.text}</span>

<style lang="stylus">
  .mark--strong {
    font-weight: 600;
  }

  .mark--em {
    font-style: italic;
  }

</style>