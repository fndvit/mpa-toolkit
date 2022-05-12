<script lang="ts">

  const defaultText = `Try asking us anything`;
  let search: string;
  let strokeWidth = 1.5;
  let writing = false;

  const searchButtonClicked = () => {}

  const hovering = () => { strokeWidth = 2.25 }

  const blurring = () => { strokeWidth = 1.5 }

</script>

<div class="container">

  <input class="text" bind:value={search} placeholder={defaultText}>

  <div class="search-icon" on:click={searchButtonClicked} on:mouseenter={hovering} on:mouseleave={blurring}>
      <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path class="search-path" d="M15.5 15.5L19 19" />
          <path class="search-path" d="M5 11C5 14.3137 7.68629 17 11 17C12.6597 17 14.1621 16.3261 15.2483 15.237C16.3308 14.1517 17 12.654 17 11C17 7.68629 14.3137 5 11 5C7.68629 5 5 7.68629 5 11Z"/>
      </svg>
  </div>
</div>

<style lang="scss">

  .search-path {
    stroke:#FFFFFF;
    stroke-width: inherit;
    stroke-linecap:round;
    stroke-linejoin:round;
  }

  .container {
    background: rgba(249, 249, 249, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-sizing: border-box;
    box-shadow: inset 0px 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding-left: 25px;
    padding-right: 25px;
    overflow: hidden;
  }

  input::placeholder {
    color: #FFFFFF;
  }

  .search-icon {
    stroke-width: 1.5;
    display: inline-block;
    cursor: pointer;
  }

  .search-icon :hover {
    stroke-width: 2.25;
  }

  .text {
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: #FFFFFF;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    display: inline-block;
    background: none;
    border: none;
    outline: none;
    margin-bottom: 0px;
  }

</style>