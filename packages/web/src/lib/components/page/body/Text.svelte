<script lang="ts">
  import type { LinkMark, TextBlock } from '@mpa/db';
  export let block: TextBlock;

  const markClasses = block.marks ? block.marks.map(mark => `mark--${mark.type}`) : [];
  const link = block.marks?.find(mark => mark.type === 'link') as LinkMark;
</script>

{#if link}
  <a class={markClasses.join(' ')} href={link.attrs.href} title={link.attrs.title} target="_blank">{block.text}</a>
{:else}
  <span class={markClasses.join(' ')}>{block.text}</span>
{/if}

<style lang="postcss">
  .mark--strong {
    font-weight: 700;
  }

  .mark--em {
    font-style: italic;
  }
</style>
