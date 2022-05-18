<script lang="ts">
  import MadLibSelector from "./MadLibSelector.svelte";
  const madlibImage = '/static/madlib_background.png';

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

<div class="container" style="background-image: url({madlibImage})" >
  <div class="mad-lib">
    <h2>Find information relevant to you.</h2>
      <p>
        I am <MadLibSelector type={'landing'} options={typeUserList} bind:selected={typeUser}/> and want help<br>
        finding <MadLibSelector type={'landing'} options={objectiveList} bind:selected={objective}/>
        to <MadLibSelector type={'landing'} options={objectiveVerbList} bind:selected={objectiveVerb}/>
        decisions<br> <MadLibSelector type={'landing'} options={actionSubjectList} bind:selected={actionSubject}/>
      </p>
      <div class="button" tabindex="0" on:click={submit}>
        <p>Start your tour</p>
          <svg class="svg-arrow" viewBox="0 0 13 22">
            <path d="M1.44165 20.5881L10.4526 11.0587L1.44165 1.52931" stroke="#2A2A2A" stroke-width="2.4"/>
          </svg>
      </div>
  </div>
</div>

<style lang="scss">

  .container {
    margin-top: 35px;
    background: #096EAE;
    position: relative;
    height: 650px;
    padding: 6rem;
    padding-bottom: 3rem;
    padding-left: 124px;
    background-size: cover;
    background-position: bottom;
  }

  .mad-lib {
    line-height: 40px;
    padding-top: 0.5rem;
    padding-bottom: 2rem;
    font-weight: 300;
    font-size: 32px;
    height: 750px;

    h2 {
      font-size: 48px;
      line-height: 58.5px;
      margin-top: 6rem;
      max-width: 620px;
      color: #FFFFFF;
      font-weight: 300;
    }

    p {
      margin-top: 0.5rem;
      color: white;
    }
  }


  .button {
    transform: translateX(-21.6px);
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
    display: inline-block;
    position: relative;
    border-radius: 24px;
    padding: 0.3rem 1.5rem 0.3rem 1.35rem;
    border: none;
    background-color: #FBE26B;
    color: #2A2A2A;
    cursor: pointer;
    font-family: 'Montserrat';
    font-size: 20px;
    font-weight: bold;
    line-height: 40px;
    margin: 0px;

    p {
      display: inline-block;
      font-family: 'Montserrat';
      font-size: 20px;
      font-weight: bold;
      line-height: 40px;
      margin: 0px;
      color: #2A2A2A;
    }
  }

  .button:hover {
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.35);
  }

  .svg-arrow {
    display: inline-block;
    position: relative;
    padding-left: 1rem;
    vertical-align: middle;
    transform: translateY(-0.15rem);
    width: 13px;
    height: 22px;
    fill: none;
  }

</style>

