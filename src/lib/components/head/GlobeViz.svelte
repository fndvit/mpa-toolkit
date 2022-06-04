<script lang="ts">

  export let lat: number;
  export let long: number;

  const isCoordValid = (val: any) => val != null && !isNaN(val);

  $: valid = isCoordValid(lat) && isCoordValid(long);

</script>

{#if valid}
  <img class="globe" src="/globe.svg?lat={lat}&long={long}" alt="globe"/>
{:else}
  <div class="globe" />
{/if}

<style>
  .globe {
    background: #04558E;
    border-radius: 50%;
    width: 245px;
    height: 245px;
  }
</style>
