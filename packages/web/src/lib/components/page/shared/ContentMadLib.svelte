<script lang="ts">
  import MadLib from '$lib/components/shared/MadLib.svelte';
  import { userHistory } from '$lib/history';

  let slug: string;
  let tags: string[];

  const setMadlibAnswers = () => userHistory.setMadlibAnswers(tags);

  $: action = slug ? `/recommended/${slug}/` : null;
</script>

<div class="content-madlib">
  <h5>Is this not for you?</h5>

  <MadLib bind:tags bind:slug />

  <form {action} on:submit={setMadlibAnswers}>
    <button tabindex="0">
      Let's find what you need
      <svg class="arrow" width="13" height="8" viewBox="0 0 13 8" fill="none">
        <path d="M0.630249 1L6.36134 6.5L12.0924 1" stroke-width="1.5" />
      </svg>
    </button>
  </form>
</div>

<style lang="postcss">
  .content-madlib {
    position: relative;
    box-shadow: inset 0 2px 12px rgb(0 0 0 / 5%);
    border-radius: 40px 0 0 40px;
    color: $c-neutral-dark;
    background: $c-neutral-bg;
    padding: 0.75rem 1.5rem 2rem;

    h5 {
      font: $f-h5;
      color: black;
      margin: 5px 0 0;
    }

    :global(.madlib) {
      max-width: 570px;
      line-height: 2.5rem;
    }

    :global(.madlib-selector) {
      color: #333;
    }
  }

  .content-madlib button {
    font: $f-h5;
    display: inline-block;
    cursor: pointer;
    vertical-align: middle;
    border: none;
    position: absolute;
    right: 0;
    bottom: 0;
    align-content: center;
    background: $c-highlight-1;
    color: $c-neutral-black;
    padding: 0.5rem 0.2rem 0.5rem 1.25rem;
    border-radius: 20px 0 0;
    box-shadow: 0 -2px 8px 0 rgb(0 0 0 / 10%);

    &:hover {
      box-shadow: 0 -2px 8px 0 rgb(0 0 0 / 15%);
      filter: brightness(105%);
    }

    .arrow {
      position: relative;
      vertical-align: middle;
      padding-left: 0.7rem;
      transform: rotate(-90deg) scale(1.35) translateX(-0.25rem);
      overflow: hidden;
      outline: none;
    }

    svg path {
      stroke: $c-neutral-black;
    }
  }

  @mixin breakpoint content, small {
    .content-madlib {
      border-radius: 0 50px 0 0;

      :global(.madlib) {
        line-height: 2rem;
      }
    }
  }
</style>
