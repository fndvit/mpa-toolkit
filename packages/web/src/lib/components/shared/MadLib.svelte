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
    'promote ecotourism',
    "(I don't know)"
  ];
  const objectiveVerbList = ['plan new MPAs', 'evaluate progress', 'enable decision-making'];
  const actionSubjectList = ['government', 'communities', 'private sector', 'civil society'];

  export let value: string[] = ['MPA planner', 'restore areas', 'plan new MPAs', 'government'];
  export let slug = '';
  export let tags: string[] = [];

  $: tags = value.map(v => TAG_VALUES[v]);
  $: slug = tags.map(t => slugify(t)).join('+');
</script>

<p class="madlib">
  I am a <MadLibSelector options={typeUserList} bind:selected={value[0]} /> using MPAs to <MadLibSelector
    options={objectiveList}
    bind:selected={value[1]}
  /> and I need help to
  <MadLibSelector options={objectiveVerbList} bind:selected={value[2]} /> by
  <MadLibSelector options={actionSubjectList} bind:selected={value[3]} />
</p>

<style lang="postcss">
  .madlib {
    @mixin font-responsive h4-light;

    position: relative;

    :global(.content-madlib) & {
      @mixin font-responsive ui-large;
    }
  }
</style>
