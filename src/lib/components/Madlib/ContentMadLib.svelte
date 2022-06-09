<script lang="ts">
  import MadLib from './MadLib.svelte';

  let value: string[] = [];

  const submit = () => {
    alert("USER PERSONA: \n1: " + value[0] + "\n2: "
    + value[1] + "\n3: " + value[2] + "\n4: " + value[3]);
  };

</script>

<div class="content-madlib">

  <h2>Is this not for you?</h2>

  <MadLib />

  <button tabindex="0" on:click={submit}>
    Let's find what you need
    <svg class="arrow" width="13" height="8" viewBox="0 0 13 8" fill="none">
      <path d="M0.630249 1L6.36134 6.5L12.0924 1" stroke-width="1.5"/>
    </svg>
  </button>

</div>

<style lang="stylus">

  .content-madlib {
    position: relative;
    box-shadow: inset 0px 2px 12px rgba(0, 0, 0, 0.05);
    border-radius: 40px 0px 0px 40px;
    color: $colors.neutral-dark;
    background: $colors.neutral-bg;
    padding: 0.75rem 1.5rem 2rem;
    font-family: 'Montserrat';

    font-size: 1.25rem;
    line-height: 2;

    h2 {
      color: black;
      font-weight: 700;
      font-size: 16px;
      margin: 5px 0px 0px 0px;
    }

    :global(.madlib) {
      max-width: 600px;
    }

    :global(.madlib-selector) {
      color: #333;
      font-weight: 400;
    }

  }

  .content-madlib button {
    display: inline-block;
    cursor: pointer;
    font-weight: 700;
    vertical-align: middle;
    font-family: 'Montserrat';
    border: none;
    font-size: 16px;
    position:absolute;
    right:0;
    bottom: 0;
    align-content: center;
    background: $colors.highlight-1;
    color: $colors.neutral-black;
    padding: 0.5rem 0.2rem 0.5rem 1.25rem;
    border-radius: 20px 0px 0px 0px;
    box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.1);
    &:hover {
      box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.15);
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
      stroke: $colors.neutral-black;
    }

  }

  @media screen and (max-width: 840px) {
    .content-madlib {
      border-radius: 0px 50px 0px 0px;
    }
  }

</style>
