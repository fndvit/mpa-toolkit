import * as d3 from 'd3-geo';
import { optimize } from 'svgo';
import { feature } from 'topojson-client';
import worldData from './110m.json';
import { simplify, presimplify } from 'topojson-simplify';

const presimplified = presimplify(worldData as any);
const simplified = simplify(presimplified, 0.1);
const land = feature(simplified, simplified.objects.land);

const SVG_SIZE = 500;

export function getGlobePaths(lat: number, long: number) {
  const LAT_OFFSET = 5;
  const LON_OFFSET = -7.5;
  const ROLL_OFFSET = 0;

  const projection = d3.geoOrthographic()
    .rotate([-long + LON_OFFSET, -lat + LAT_OFFSET, ROLL_OFFSET])
    .scale(SVG_SIZE / 2)
    .translate([SVG_SIZE / 2, SVG_SIZE / 2]);

  const path = d3.geoPath().projection(projection);

  const circleGenerator = d3.geoCircle()
    .center([long, lat])
    .radius(2);

  const circlePath = path(circleGenerator());

  const externalCircleGenerator = d3.geoCircle()
    .center([long, lat])
    .radius(4);
  const externalCirclePath = path(externalCircleGenerator());

  const graticuleGenerator = d3.geoGraticule().step([10,10]);
  const graticulePath = path(graticuleGenerator());

  const landPath = path(land);

  return {
    graticulePath,
    landPath,
    circlePath,
    externalCirclePath
  };

}

const svg = ({graticulePath, landPath, circlePath, externalCirclePath}) =>
`
<svg viewBox='0 0 ${SVG_SIZE} ${SVG_SIZE}' xmlns="http://www.w3.org/2000/svg">
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

  </style>
  <path d="${graticulePath}" class="graticules" />
  <path d="${landPath}" class="land" />
  <path d="${circlePath}" class="circle" />
  <path d="${externalCirclePath}" class="external-circle" />
</svg>
`;

export const generateGlobeSvg = (lat: number, long: number) => {
  const paths = getGlobePaths(lat, long);
  const r = optimize(svg(paths), { floatPrecision: 1 });

  if ('data' in r) return r.data;
  else throw new Error('SVG Optimizer error: ' + r.error);
};
