<script lang="ts">
  import { scale } from 'svelte/transition';

  export let type: 'landing'|'inline' = 'inline';
  export let options: string[];
  export let selected = options[0];

  let currentIndex = 0;
  let listboxVisible = false;

  const chooseOption = (index: number) => {
    currentIndex = index;
    selected = options[currentIndex];
    listboxVisible = false;
  }

  const handleKeyDown = ({keyCode}) => {
    if (listboxVisible){
      if (keyCode === 38 && currentIndex > 0){
        currentIndex--;
        selected = options[currentIndex];
      }
      else if (keyCode === 40 && currentIndex < options.length - 1){
        currentIndex++;
        selected = options[currentIndex];
      }
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="area" >
  <button class="selector-area" class:landing={type === 'landing'}
    on:click={() => listboxVisible = !listboxVisible}
    on:blur={() => listboxVisible = false}
  >
    <div class="arrow">
      <svg class="svg" width="13" height="8" viewBox="0 0 13 8" fill="none">
        <path d="M0.630249 1L6.36134 6.5L12.0924 1" stroke="#2A2A2A" stroke-width="1.5"/>
      </svg>
    </div>
    {selected}
  </button>

  {#if listboxVisible}
    <ul class="listbox" class:landing={type === 'landing'} transition:scale>
      {#each options as opt, i}
        <li class={options[currentIndex] === opt ? "option-selected" : "option"}
          on:focus={() => chooseOption(i)} tabindex="-1">
          {opt}
        </li>
      {/each}
    </ul>
  {/if}
</div>


<style lang="scss">

  .area {
    display: inline-block;
    line-height: 100%;
  }

  .option {
    display: block;
    background-color: #F9F9F9;
    color: black;
    border: none;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    cursor: pointer;
    font-family: 'Montserrat';
    font-size: 20px;
    font-weight: normal;
  }

  .option-selected {
    display: block;
    background-color: #F9F9F9;
    color: black;
    border: none;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    cursor: pointer;
    font-family: 'Montserrat';
    font-size: 20px;
    font-weight: normal;
    filter: drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.15));
    border-radius: 10px;
  }

  .option:hover{
    filter: drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.15));
    border-radius: 10px;
  }

  .selector-area {
    display: inline-block;
    vertical-align: middle;
    border-radius: 20px;
    background-color: #F9F9F9;
    color: black;
    border: none;
    padding: 0.25rem 0.7rem 0.25rem 0.7rem;
    margin-bottom: 0.4rem;
    cursor: pointer;
    filter: drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.15));
    font-family: 'Montserrat';
    font-size: 20px;
    font-weight: normal;

    &.landing {
      font-size: 32px;
      line-height: 40px;
      color: #FFFFFF;
      font-weight: 600;
      background: rgba(249, 249, 249, 0.06);
      background-blend-mode: soft-light;
      box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.4);
      border-radius: 30px;
    }
  }

  .selector-area:focus {
    outline: 0.1rem solid black;

    &.landing {
      outline: 0.1rem solid white;
    }
  }

  .listbox {
    margin-top: 0.5rem;
    position: absolute;
    display: block;
    filter: drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.15));
    padding: 0.35rem 0.7rem 0.35rem 0.7rem;
    border-radius: 20px;
    background-color: #F9F9F9;
    color: black;
    border: none;
    z-index: 1000;

    &.landing {
      border-radius: 30px;
    }
  }

  .arrow {
    display: inline-block;
    vertical-align: top;
  }

  .svg {
    vertical-align: middle;
    transform: translateY(-0.1rem);
  }

</style>
