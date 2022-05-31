<script lang="ts">

  export let lat: number;
  export let long: number;

</script>

<img class="globe" src="/globe.svg?lat={lat}&long={long}" alt="globe"/>

<style>
  .globe {
    background: #04558E;
    border-radius: 50%;
    width: 245px;
    height: 245px;
  }
</style>
