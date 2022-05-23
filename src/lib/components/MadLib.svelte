<script lang="ts">
  import MadLibSelector from "$lib/components/MadLibSelector.svelte";
  import landingMadlibBg from '$lib/assets/landing-madlib-bg.png';

  export let type: 'inline' | 'landing' = 'inline';

  const typeUserList = ['an MPA planner', 'an MPA manager', 'a community organizer', 'an LMMA practitioner'];
  const objectiveList = ['answers', 'examples', 'case studies', 'tools'];
  const objectiveVerbList = ['enable', 'evaluate'];
  const actionSubjectList = ['I need to make','my team will make','my government needs to make'];

  let typeUser: string;
  let objective: string;
  let objectiveVerb: string;
  let actionSubject: string;

  $: userPersona = [typeUser, objective, objectiveVerb, actionSubject];

  const submit = () => {
    alert("USER PERSONA: \n1: " + userPersona[0] + "\n2: "
    + userPersona[1] + "\n3: " + userPersona[2] + "\n4: " + userPersona[3]);
  };

</script>

<div class="container" class:landing={type==='landing'} style="--background-image: url({landingMadlibBg})">

  {#if type==='landing'}
    <h2>Find information relevant to you.</h2>
  {:else}
    <h5>Is this not for you?</h5>
  {/if}

  <p>I am <MadLibSelector {type} options={typeUserList} bind:selected={typeUser}/> and want help
    <br> finding <MadLibSelector {type} options={objectiveList} bind:selected={objective}/> to
    <MadLibSelector {type} options={objectiveVerbList} bind:selected={objectiveVerb}/> decisions
    <br><MadLibSelector {type} options={actionSubjectList} bind:selected={actionSubject}/>
  </p>

  {#if type==='inline'}
    <div class="button" tabindex="0" on:click={submit}>
      Let's find what you need
      <svg class="arrow" width="13" height="8" viewBox="0 0 13 8" fill="none">
        <path d="M0.630249 1L6.36134 6.5L12.0924 1" stroke="#2A2A2A" stroke-width="1.5"/>
      </svg>
    </div>
  {:else}
  <div class="button" tabindex="0" on:click={submit}>
    <p>Start your tour</p>
      <svg class="arrow" viewBox="0 0 13 22">
        <path d="M1.44165 20.5881L10.4526 11.0587L1.44165 1.52931" stroke="#2A2A2A" stroke-width="2.4"/>
      </svg>
  </div>
  {/if}

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

    h2 {
      font-size: 48px;
      line-height: 58.5px;
      margin-top: 6rem;
      max-width: 620px;
      color: #FFFFFF;
      font-weight: 300;
    }

    &.landing {
      width: auto;
      border-radius: 0px;
      margin-top: 35px;
      padding-top: 0.5rem;
      background: #096EAE;
      position: relative;
      height: 600px;
      padding: 6rem;
      padding-bottom: 5rem;
      padding-left: 124px;
      background-size: cover;
      background-position: bottom;
      line-height: 40px;
      font-weight: 300;
      font-size: 32px;
      background-image: var(--background-image);
      transform: translateX(0px);

      p {
        margin-top: 0.5rem;
        color: white;
        line-height: 40px;
        font-weight: 400;
        font-size: 32px;
      }
    }
  }

  .button {
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
    color: #2A2A2A;
    padding: 0rem 0.2rem 0rem 1.25rem;
    border-radius: 20px 0px 0px 0px;
    filter: drop-shadow(0px -2px 8px rgba(0, 0, 0, 0.1));

    .landing & {
      transform: translateX(-21.6px);
      box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
      position: relative;
      border-radius: 24px;
      padding: 0.3rem 1.5rem 0.3rem 1.35rem;
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
      line-height: 40px;
      margin: 0px;

      p {
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
        margin: 0px;
        color: #2A2A2A;
      }

      :hover {
        filter: drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.25));
      }
    }
  }

  .button:hover {
    filter: drop-shadow(0px -3px 12px rgba(0, 0, 0, 0.15));
  }

  .arrow {
    position: relative;
    vertical-align: middle;
    padding-left: 0.7rem;
    transform: rotate(-90deg) scale(1.35) translateX(-0.25rem);
    overflow: hidden;
    outline: none;

    .landing & {
      display: inline-block;
      position: relative;
      padding-left: 1rem;
      vertical-align: middle;
      transform: translateY(-0.15rem);
      width: 13px;
      height: 22px;
      fill: none;
    }
  }

</style>
