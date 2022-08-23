<script lang="ts">
  import { MadLib } from '$lib/components';
  import { slugify } from '$lib/utils';

  let value: string[] = [];

  const tagValue = {
    'an MPA planner': 'MPA planners',
    'an MPA manager': 'MPA managers',
    'a community organizer': 'Community organizers',
    'an LMMA practitioner': 'LMMA practitioners',
    'answers': 'Identifying solutions',
    'examples': 'Exploring examples',
    'case studies': 'Comparing case studies',
    'tools': 'Discovering tools',
    'enable': 'Enabling decision-making',
    'evaluate': 'Evaluating progress',
    'I need to make': 'Manager decision-making',
    'my team will make': 'Team decision-making',
    'my government needs to make': 'Government decision-making'
  };

  $: action =
    '/recommended/' +
    slugify(tagValue[value[0]]) +
    '+' +
    slugify(tagValue[value[1]]) +
    '+' +
    slugify(tagValue[value[2]]) +
    '+' +
    slugify(tagValue[value[3]]) +
    '/';

</script>

<div class="content-madlib">
  <h5>Is this not for you?</h5>

  <MadLib bind:value/>

  <form {action}>
    <button tabindex="0">
      Let's find what you need
      <svg class="arrow" width="13" height="8" viewBox="0 0 13 8" fill="none">
        <path d="M0.630249 1L6.36134 6.5L12.0924 1" stroke-width="1.5" />
      </svg>
    </button>
</form>
</div>

<style lang="stylus">

  .content-madlib {
    position: relative;
    box-shadow: inset 0px 2px 12px rgba(0, 0, 0, 0.05);
    border-radius: 40px 0px 0px 40px;
    color: $colors.neutral-dark;
    background: $colors.neutral-bg;
    padding: 0.75rem 1.5rem 2rem;

    h5 {
      typography: h5;
      color: black;
      margin: 5px 0px 0px 0px;
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
    typography: h5;
    display: inline-block;
    cursor: pointer;
    vertical-align: middle;
    border: none;
    position: absolute;
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

  +breakpoint(page, small) {

    .content-madlib {
      border-radius: 0px 50px 0px 0px;

      :global(.madlib) {
        line-height: 2rem;
      }
    }
  }

</style>
