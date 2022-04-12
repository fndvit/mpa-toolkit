<script lang="ts">
  import * as d3 from "d3-geo";
  import { feature } from "topojson";
  import worlddata from "./110m.json";

  export let highlight: {lat: number, lon: number};
  export let width = 500;

  const latitudeOffset = 5;
  const longitudeOffset = -7.5;
  const rollOffset = 0;

  const projection = d3.geoOrthographic()
    .rotate([-highlight.lon + longitudeOffset, -highlight.lat + latitudeOffset, rollOffset])
    .scale(width / 2)
    .translate([width / 2, width / 2]);

  const path = d3.geoPath().projection(projection);

  const circleGenerator = d3.geoCircle()
    .center([highlight.lon, highlight.lat])
    .radius(2);
  const circlePath = path(circleGenerator());

  const externalCircleGenerator = d3.geoCircle()
    .center([highlight.lon, highlight.lat])
    .radius(4);
  const externalCirclePath = path(externalCircleGenerator());

  const graticuleGenerator = d3.geoGraticule()
    .step([10,10]);
  const graticulePath = path(graticuleGenerator());

  const land = feature(worlddata, worlddata.objects.land);
  const landPath = path(land);

</script>


<div class="globe">
  <svg {width} height={width}>
    <path d={graticulePath} class="graticules" />
    <path d={landPath} class="land" />
    <path d={circlePath} class="circle" />
    <path d={externalCirclePath} class="external-circle" />
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