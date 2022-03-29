<script lang="ts">
  import * as d3 from "d3-geo";
  import { onMount } from "svelte";
  import { feature } from "topojson";
  import worlddata from "./110m.json";

  export let highlight: {lat: number, lon: number};
  export let width: number = 500;

  const latitudeOffset:number = 5;
  const longitudeOffset:number = -7.5;
  const rollOffset = 0;

  const projection = d3.geoOrthographic();
  projection.rotate([-highlight.lon + longitudeOffset, -highlight.lat + latitudeOffset, rollOffset]);
  projection.scale(width/2);
  projection.translate([width/2, width/2]);
  const path = d3.geoPath().projection(projection);

  let circleGenerator = d3.geoCircle()
    .center([highlight.lon, highlight.lat])
    .radius(2);
  let circlePath = path(circleGenerator());

  let externalCircleGenerator = d3.geoCircle()
    .center([highlight.lon, highlight.lat])
    .radius(4);
  let externalCirclePath = path(externalCircleGenerator());


  let graticuleGenerator = d3.geoGraticule()
    .step([10,10]);
  let graticulePath = path(graticuleGenerator());

  let landPath;
  onMount(async function() {
    const response = worlddata;
    const json = response;
    const land = feature(json, json.objects.land);
    landPath = path(land);
  });

</script>


<div class="globe">
<svg width={width} height={width}>
  <path d={graticulePath} class="graticules"></path>
  <path d={landPath} class="land"/>
  <path d={circlePath} class="circle"></path>
  <path d={externalCirclePath} class="external-circle"></path>
</svg>
</div>


<style>

.external-circle {
  stroke: #FCE587;
  stroke-width: 1.25px;
  fill:none;
}

.circle {
  stroke-width: 0px;
  fill: #FCE587;
}

.graticules {
  fill: none;
  stroke-width: 0.25px;
  stroke: #3677a5;
}

svg {
  background: #04558E;
  border-radius: 50%;
}

.land {
  stroke-width: 0px;
  stroke: black;
  fill: #3677a5;
}

</style>