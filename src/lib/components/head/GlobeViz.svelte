<script lang="ts">

  export let lat: number;
  export let long: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isCoordValid = (val: unknown) => val != null && !isNaN(val as any);

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
