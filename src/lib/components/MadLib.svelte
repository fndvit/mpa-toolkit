<script lang="ts">
  import MadLibSelector from "./MadLibSelector.svelte";

  export let type:'inline'|'landing' = 'inline';

  const typeUserList = ['an MPA planner', 'an MPA manager', 'a community organizer', 'an LMMA practitioner'];
  const objectiveList = ['answers', 'examples', 'case studies', 'tools'];
  const objectiveVerbList = ['enable', 'evaluate'];
  const actionSubjectList = ['I need to make','my team will make','my government needs to make'];

  let typeUser: string;
  let objective: string;
  let objectiveVerb: string;
  let actionSubject: string;

  const submit = () => {
    alert("USER PERSONA: \n1: " + userPersona[0] + "\n2: "
    + userPersona[1] + "\n3: " + userPersona[2] + "\n4: " + userPersona[3]);
  }

  $: userPersona = [typeUser, objective, objectiveVerb, actionSubject];

</script>

<div class="container" class:landing={type==='landing'}>
  <h5>Is this not for you?</h5>

  <p>I am <MadLibSelector options={typeUserList} bind:selected={typeUser}/> and want
    <br> <MadLibSelector options={objectiveList} bind:selected={objective}/> to
    <MadLibSelector options={objectiveVerbList} bind:selected={objectiveVerb}/>
    decisions <br> <MadLibSelector options={actionSubjectList} bind:selected={actionSubject}/></p>

  <div class="find-button" tabindex="0" on:click={submit}>
    Let's find what you need
    <svg class="svg-arrow" width="13" height="8" viewBox="0 0 13 8" fill="none">
      <path d="M0.630249 1L6.36134 6.5L12.0924 1" stroke="#2A2A2A" stroke-width="1.5"/>
    </svg>
  </div>

</div>

<style lang="scss">

  .container {
    position: relative;
    line-height: 40px;
    color: #6C767D;
    background: #F9F9F9;
    box-shadow: inset 0px 2px 12px rgba(0, 0, 0, 0.05);
    border-radius: 40px 0px 0px 40px;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1.5rem;
    font-family: 'Montserrat';
    transform: translateX(-25px);
    width: calc(100vw - 368px);

    p {
      margin-top: 0.5rem;
      color: #6C767D;
      font-size: 20px;
    }

    h5 {
      color: black;
      font-weight: 700;
      font-size: 16px;
      margin: 5px 0px 0px 0px;
    }
  }

  .find-button {
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
    background: #FBE26B;
    color: black;
    padding: 0rem 0.2rem 0rem 1.25rem;
    border-radius: 20px 0px 0px 0px;
    filter: drop-shadow(0px -2px 8px rgba(0, 0, 0, 0.1));
  }

  .find-button:hover {
    filter: drop-shadow(0px -3px 12px rgba(0, 0, 0, 0.15));
  }

  .svg-arrow {
    position: relative;
    vertical-align: middle;
    padding-left: 0.7rem;
    transform: rotate(-90deg) scale(1.35) translateX(-0.25rem);
    overflow: hidden;
    outline: none;
  }

</style>
