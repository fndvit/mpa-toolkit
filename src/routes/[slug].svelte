<script context="module" lang="ts">
  // export async function load({ params, fetch, stuff }) {
  //   return {
  //     maxage: 3600,
  //     props: {
  //     }
  //   };
  // }
</script>

<script lang="ts">
  import { staticUrl } from "$lib/helpers";
  import type { Page, ContentBlock, User, HeadingBlock } from "$lib/types";

  export let page: Page & { authors: User[] };
  export let content: ContentBlock[];

  const headings = content.filter(b => b.type === 'heading') as HeadingBlock[];

</script>

<div>
  <div class="splash" style="background-image: url({staticUrl(page.img)});">
    <h1>{page.title}</h1>
  </div>

  <div class="meta">
    <div class="authors">
      {#each page.authors as author}
        <div>{author.name}</div>
      {/each}
    </div>
    <div class="summary">{page.summary}</div>
  </div>
  <div class="content">
    <div class="menu-column">
      <div class="menu">
        {#each headings as heading}
          <h3>{heading.text}</h3>
        {/each}
      </div>
    </div>
    <div class="body-column">
      {#each content as block}
        {#if block.type === 'heading' || block.type === 'paragraph'}
          {@html block.html}
        {:else}
          Not implemented
        {/if}
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .splash {
    min-height: 60vh;
    display: flex;
    align-items: flex-end;
    padding: 6rem;
    padding-bottom: 3rem;
    h1 {
      max-width: 800px;
      color: white;
    }
  }
  .meta {
    background: #096EAE;
    color: white;
    padding: 2rem 6rem;
  }
  .authors {
    margin-bottom: 2rem;
  }
  .summary {
    font-family: var(--font-serif);
    font-size: 1.8rem;
    line-height: 1.5;
    max-width: 800px;
  }
  .content {
    padding: 2rem 6rem;
    display: grid;
    grid-template-columns: 15rem 40rem;
    column-gap: 1rem;
    :global(h1) {
      font-size: 2.5rem;
    }
  }
</style>