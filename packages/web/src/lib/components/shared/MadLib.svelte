<script lang="ts" context="module">
  import { slugify } from '@mpa/utils';
  import MadLibSelector from './MadLibSelector.svelte';

  const tagValue = {
    //I am a:
    'MPA planner': 'MPA planners',
    'MPA manager': 'MPA managers',
    'community advocate': 'Community advocates',
    'community practitioner': 'Community practitioners',

    //and amb using MPA to
    'restore areas': 'Restoring areas',
    'reduce user conflict': 'Reducing user conflict',
    'meet targets': 'Meeting targets',
    'promote ecoturism': 'Promoting ecoturism',
    '(I don\'t know)': 'I don\'t know',

    //and i need help to
    'plan new MPAs': 'Planing new MPAs',
    'evaluate progress': 'Evaluating progress',
    'eneble decision-making': 'Enabling decision-making',

    //by
    'government': 'Government',
    'communities': 'Communities',
    'private sector': 'Private sector',
    'civil society': 'Civil society',
  };

  export function buildTagSlug(value: string[]) {
    return value
      .map(v => tagValue[v])
      .map(str => slugify(str))
      .join('+');
  }
</script>

<script lang="ts">
  const typeUserList = ['MPA planner', 'MPA manager', 'community advocate', 'community practitioner'];
  const objectiveList = ['restore areas', 'reduce user conflict', 'meet targets', 'promote ecoturism', '(I don\'t know)'];
  const objectiveVerbList = ['plan new MPAs', 'evaluate progress', 'eneble decision-making'];
  const actionSubjectList = ['government', 'communities', 'private sector', 'civil society'];

  export let value: string[] = [null, null, null, null];
</script>

<p class="madlib">
  I am a <MadLibSelector options={typeUserList} bind:selected={value[0]} /> using MPAs to <MadLibSelector
    options={objectiveList}
    bind:selected={value[1]}
  /> and I need help to
  <MadLibSelector options={objectiveVerbList} bind:selected={value[2]} /> by
  <MadLibSelector options={actionSubjectList} bind:selected={value[3]} />
</p>

<style lang="stylus">

  .madlib {
    typography: h4-light-responsive;
    position: relative;

    :global(.content-madlib) & {
      typography: ui-large-responsive;
    }
  }

</style>
