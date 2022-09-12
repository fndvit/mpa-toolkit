<script lang="ts">
  import MadLib, { buildTagSlug, buildTagMadlib } from '../shared/MadLib.svelte';
  import landingMadlibBg from '$lib/assets/landing-madlib-bg.jpg';
  import { userHistory } from '$lib/history';

  let value: string[] = [];

  const setMadlibAnswers = () => {
    userHistory.setMadlibAnswers(buildTagMadlib(value));
  };

  $: action = `/recommended/${buildTagSlug(value)}/`;
</script>

<div class="landing-madlib" style="--background-image: url({landingMadlibBg})">
  <h2>Find information <b>relevant to you</b>.</h2>

  <MadLib bind:value />

  <form {action} on:click={setMadlibAnswers}>
    <button tabindex="0">
      Start your tour
      <svg class="arrow" viewBox="0 0 13 22">
        <path d="M1.44165 20.5881L10.4526 11.0587L1.44165 1.52931" stroke-width="2.4" />
      </svg>
    </button>
  </form>
</div>

<style lang="stylus">

  .landing-madlib {
    color: white;
    padding-bottom: 0.5rem;
    width: auto;
    margin-top: 35px;
    padding: 0.5rem var(--page-padding) 5rem;
    background: $colors.primary-blue;
    height: 600px;
    background-size: cover;
    background-position: bottom;
    background-image: var(--background-image);

    > :global(.madlib) {
      margin-top: 0.5rem;
      line-height: 3rem;
      max-width: 700px;

      > :global(.madlib-selector) {
        font-weight: 600;
      }
    }

    h2 {
      typography: h2-responsive;
      margin-top: 6rem;
      color: #FFFFFF;
    }

    svg path {
      stroke: $colors.neutral-black;
    }

  }

  .landing-madlib button {
    typography: h4-responsive;
    cursor: pointer;
    border: none;
    background: $colors.highlight-1;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
    position: relative;
    border-radius: 24px;
    padding: 0.8rem 1.5rem 0.8rem 1.35rem;
    cursor: pointer;
    margin: 2rem 0 2rem;

    &:hover {
      box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.3);
      filter: brightness(95%);
    }
  }

  .arrow {
    position: relative;
    vertical-align: middle;
    padding-left: 0.7rem;
    transform: rotate(-90deg) scale(1.35) translateX(-0.25rem);
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

  +breakpoint(page, medium) {
    .landing-madlib {
      width: auto;
      height: auto;
      background-position: left;

      button {
        margin: 2rem 0 2rem;
      }
    }
  }

  +breakpoint(page, small) {

    .landing-madlib {

      > :global(.madlib) {
        line-height: 2.5rem;
      }

      h2 {
        margin-bottom: 3rem;
      }

      button {
        padding: 0.55rem 0.95rem 0.45rem 0.85rem;
      }

    }
  }


</style>
