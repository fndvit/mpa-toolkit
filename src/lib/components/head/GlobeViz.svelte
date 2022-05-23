<script lang="ts">
  import * as d3 from "d3-geo";
  import { feature } from "topojson-client";

  export let lat: number;
  export let long: number;

  const SVG_SIZE = 500;
  const LAT_OFFSET = 5;
  const LON_OFFSET = -7.5;
  const ROLL_OFFSET = 0;
  let landPath: string;

  const projection = d3.geoOrthographic()
    .rotate([-long + LON_OFFSET, -lat + LAT_OFFSET, ROLL_OFFSET])
    .scale(SVG_SIZE / 2)
    .translate([SVG_SIZE / 2, SVG_SIZE / 2]);

  const path = d3.geoPath().projection(projection);

  import('./110m.json').then(({ default: worlddata }) => {
    const land = feature(worlddata as any, worlddata.objects.land as any);
    landPath = path(land);
  });

  const circleGenerator = d3.geoCircle()
    .center([long, lat])
    .radius(2);
  const circlePath = path(circleGenerator());

  const externalCircleGenerator = d3.geoCircle()
    .center([long, lat])
    .radius(4);
  const externalCirclePath = path(externalCircleGenerator());

  const graticuleGenerator = d3.geoGraticule()
    .step([10,10]);
  const graticulePath = path(graticuleGenerator());

</script>


<div class="globe" >
  {#if landPath}
    <svg viewBox='0 0 {SVG_SIZE} {SVG_SIZE}'>
      <path d={graticulePath} class="graticules" />
      <path d={landPath} class="land" />
      <path d={circlePath} class="circle" />
      <path d={externalCirclePath} class="external-circle" />
    </svg>
  {/if}
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

  .land {
    stroke-width: 0px;
    stroke: black;
    fill: #3677a5;
  }

  .globe {
    background: #04558E;
    border-radius: 50%;
    width: var(--globe-size, 245px);
    height: var(--globe-size, 245px);
  }

</style>