<script lang="ts">
  import MadLibSelector from "./MadLibSelector.svelte";

  const typeUserList = ['an MPA planner', 'an MPA manager', 'a community organizer', 'an LMMA practitioner'];
  const objectiveList = ['answers', 'examples', 'case studies', 'tools'];
  const objectiveVerbList = ['enable', 'evaluate'];
  const actionSubjectList = ['I need to make','my team will make','my government needs to make'];

  export let value: string[] = [null, null, null, null];

</script>

<p class="madlib font-h4-light">
  I am <MadLibSelector options={typeUserList} bind:selected={value[0]}/> and want help
  finding <MadLibSelector options={objectiveList} bind:selected={value[1]}/> to
  <MadLibSelector options={objectiveVerbList} bind:selected={value[2]}/> decisions
  <MadLibSelector options={actionSubjectList} bind:selected={value[3]}/>
</p>

<style lang="stylus">

  .madlib {
    position: relative;
    font-size: inherit;
    font-weight: inherit;
    line-height: 2;
  }

</style>
