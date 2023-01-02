<script lang="ts">
  export let expanded: boolean;
</script>

<div class="expand-button">
  <hr />
  <button on:click>
    <svg width="13" height="8" viewBox="0 0 13 8" fill="none" transform="scale(1, {expanded ? -1 : 1})" class="arrow">
      <path d="M0.630249 1L6.36134 6.5L12.0924 1" stroke-width="1.5" />
    </svg>
    <div>
      <slot />
    </div>
  </button>
</div>

<style lang="postcss">
  hr {
    margin: 0;
    border: 0;
    border-bottom: 0.5px solid $c-neutral-light;
  }

  .arrow {
    margin-right: 5px;
  }

  .expand-button button {
    font-family: var(--font-sans-serif);
    border: 0;
    outline: none;
    cursor: pointer;
    width: fit-content;
    align-items: center;
    padding: 0 15px;
    column-gap: 5px;
    height: 40px;
    font-size: 0.75rem;
    display: flex;
    text-align: left;
    background: $c-neutral-bg;
    box-shadow: 0 3px 16px rgb(0 0 0 / 15%);
    border-radius: 0 0 20px 20px;

    &:hover {
      filter: brightness(95%);
    }

    margin-bottom: 2rem;

    svg path {
      stroke: $c-neutral-black;
    }

    :global(.problem) & {
      outline: 5px solid #f004;
    }
  }

  @media screen and (max-width: 768px) {
    .expand-button {
      width: auto;
    }
  }
</style>
