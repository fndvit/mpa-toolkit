<script lang="ts" context="module">
  import { slugify } from '@mpa/utils';
  import MadLibSelector from './MadLibSelector.svelte';

  const TAG_VALUES = {
    // I am a
    'MPA planner': 'MPA planner',
    'MPA manager': 'MPA managers',
    'community advocate': 'Community advocates',
    'community practitioner': 'Community practitioners',

    // and am using MPAth to
    'restore areas': 'Restoring areas',
    'reduce user conflict': 'Reducing user conflicts',
    'meet targets': 'Meeting targets',
    'promote ecotourism': 'Promoting ecotourism',
    "(I don't know)": "I don't know",

    // and I need help to
    'plan new MPAs': 'Planning new MPAs',
    'evaluate progress': 'Evaluating progress',
    'enable decision-making': 'Enable decision-making',

    // by
    government: 'Government',
    communities: 'Communities',
    'private sector': 'Private sector',
    'civil society': 'Civil society'
  };
</script>

<script lang="ts">
  const typeUserList = ['MPA planner', 'MPA manager', 'community advocate', 'community practitioner'];
  const objectiveList = [
    'restore areas',
    'reduce user conflict',
    'meet targets',
    'promote ecotorurism',
    "(I don't know)"
  ];
  const objectiveVerbList = ['plan new MPAs', 'evaluate progress', 'eneble decision-making'];
  const actionSubjectList = ['government', 'communities', 'private sector', 'civil society'];

  export let value: string[] = [null, null, null, null];
  export let slug = '';
  export let tags: string[] = [];

  $: tags = value.map(v => TAG_VALUES[v]);
  $: slug = tags.map(t => slugify(t)).join('+');
</script>

<p class="madlib">
  I am a <MadLibSelector options={typeUserList} bind:selected={value[0]} /> and am using MPAth to <MadLibSelector
    options={objectiveList}
    bind:selected={value[1]}
  /> and i need help to
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
