<script lang="ts">
  import MadLibSelector from "./MadLibSelector.svelte";

  const typeUserList = ['an MPA planner', 'an MPA manager', 'a community organizer', 'an LMMA practitioner'];
  const objectiveList = ['answers', 'examples', 'case studies', 'tools'];
  const objectiveVerbList = ['enable', 'evaluate'];
  const actionSubjectList = ['I need to make','my team will make','my government needs to make'];

  export let value: string[] = [null, null, null, null];

</script>

<p class="madlib">
  I am <MadLibSelector options={typeUserList} bind:selected={value[0]}/> and want help
  finding <MadLibSelector options={objectiveList} bind:selected={value[1]}/> to
  <MadLibSelector options={objectiveVerbList} bind:selected={value[2]}/> decisions
  <MadLibSelector options={actionSubjectList} bind:selected={value[3]}/>
</p>

<style lang="scss">

  .madlib {
    position: relative;
    font-weight: 300;
    font-size: inherit;
    line-height: inherit;
    font-family: 'Montserrat';
  }

</style>
