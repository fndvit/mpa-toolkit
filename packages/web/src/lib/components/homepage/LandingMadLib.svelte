<script lang="ts">
  import MadLib from '../shared/MadLib.svelte';
  import landingMadlibBg from '$lib/assets/landing-madlib-bg.jpg';
  import { userHistory } from '$lib/history';

  let slug: string;
  let tags: string[];

  const setMadlibAnswers = () => userHistory.setMadlibAnswers(tags);

  $: action = slug ? `/recommended/${slug}/` : null;
</script>

<div
  class="landing-madlib"
  style="

--background-image: url({landingMadlibBg})"
>
  <h2>Find information <b>relevant to you</b>.</h2>

  <MadLib bind:tags bind:slug />

  <form {action} on:submit={setMadlibAnswers}>
    <button tabindex="0">
      Start your tour
      <svg class="arrow" viewBox="0 0 13 22">
        <path d="M1.44165 20.5881L10.4526 11.0587L1.44165 1.52931" stroke-width="2.4" />
      </svg>
    </button>
  </form>
  <a href="/tools-library/">
    <button tabindex="0">
      Find tools
      <svg class="arrow" viewBox="0 0 13 22">
        <path d="M1.44165 20.5881L10.4526 11.0587L1.44165 1.52931" stroke-width="2.4" />
      </svg>
    </button>
  </a>
</div>

<style lang="postcss">
  .landing-madlib {
    color: white;
    width: auto;
    /* margin-top: 35px; */
    padding: 0.5rem var(--page-padding) 5rem;
    background: $c-primary-blue;
    height: 600px;
    background-size: cover;
    background-position: bottom;
    background-image: var(--background-image);

    > :global(.madlib) {
      /* margin-top: 0.5rem; */
      line-height: 3rem;
      max-width: 700px;

      > :global(.madlib-selector) {
        font-weight: 600;
      }
    }

    h2 {
      @mixin font-responsive h2;

      margin-top: 6rem;
      color: #fff;
    }

    svg path {
      stroke: $c-neutral-black;
    }
  }

  .landing-madlib button {
    @mixin font-responsive h4;

    border: none;
    background: $c-highlight-1;
    box-shadow: 0 3px 16px rgb(0 0 0 / 15%);
    position: relative;
    border-radius: 24px;
    padding: 0.8rem 1.5rem 0.8rem 1.35rem;
    cursor: pointer;
    margin: 1rem 0 0 0;

    &:hover {
      box-shadow: 0 3px 16px rgb(0 0 0 / 30%);
      filter: brightness(95%);
    }
  }

  .arrow {
    overflow: hidden;
    outline: none;
    display: inline-block;
    position: relative;
    padding-left: 1rem;
    vertical-align: middle;
    transform: translateY(-0.15rem);
    width: 13px;
    height: 22px;
    fill: none;
  }

  @mixin breakpoint content, medium {
    .landing-madlib {
      width: auto;
      height: auto;
      background-position: left;

      button {
        margin: 1rem 0 0 0;
      }
    }
  }

  @mixin breakpoint content, small {
    .landing-madlib {
      > :global(.madlib) {
        line-height: 2.5rem;
      }

      h2 {
        margin-bottom: 3rem;
      }

      button {
        padding: 0.55rem 0.95rem 0.45rem 0.85rem;
        margin: 1rem 0 0 0;
      }
    }
  }
</style>