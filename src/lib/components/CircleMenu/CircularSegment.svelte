<script context="module" lang='ts'>
  export interface Segment {
    startAngle: number;
    endAngle: number;
    radius: number;
    x: number;
    y: number;
    gap: number;
    thickness: string;
    color: {
      background: {
        selected: string;
        unselected: string;
      }
      border: string;
    }
    transparency: boolean;
  }
  export enum Thickness {
    Main = 'main',
    Secondary = 'secondary',
    Unselected = 'unselected',
    Hover = 'hover'
  }
</script>
<script lang="ts">
  export let segmentConfig: Segment;
  export let animationDuration: number = 0.3;
  export let selectedStyle: string = Thickness.Unselected;
  export let onClickFn = () => {};

  let describeArc = (segmentConfig: Segment, currentThickness: number) => {
    let thickness = currentThickness; // Need a way to work with enums
    let startAngle = segmentConfig.startAngle + segmentConfig.gap / 2;
    let endAngle = segmentConfig.endAngle - segmentConfig.gap / 2;

    let innerStart = polarToCartesian(segmentConfig.x, segmentConfig.y, segmentConfig.radius, endAngle);
    let innerEnd = polarToCartesian(segmentConfig.x, segmentConfig.y, segmentConfig.radius, startAngle);
    let outerStart = polarToCartesian(segmentConfig.x, segmentConfig.y, segmentConfig.radius + thickness, endAngle);
    let outerEnd = polarToCartesian(segmentConfig.x, segmentConfig.y, segmentConfig.radius + thickness, startAngle);
    let largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    let d = [
      'M',
      outerStart.x,
      outerStart.y,
      'A',
      segmentConfig.radius + thickness,
      segmentConfig.radius + thickness,
      0,
      largeArcFlag,
      0,
      outerEnd.x,
      outerEnd.y,
      'L',
      innerEnd.x,
      innerEnd.y,
      'A',
      segmentConfig.radius,
      segmentConfig.radius,
      0,
      largeArcFlag,
      1,
      innerStart.x,
      innerStart.y,
      'L',
      outerStart.x,
      outerStart.y,
      'Z'
    ].join(' ');
    return d;
  };

  let polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    let angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  let states = {
    main: describeArc(segmentConfig, 30),
    secondary: describeArc(segmentConfig, 20),
    unselected: describeArc(segmentConfig, 15),
    hover: describeArc(segmentConfig, 35),
  }

  let currentState: string = states[Thickness.Unselected];
  let currentColor: string = segmentConfig.color.background.unselected;

  $: {
    currentState =  states[selectedStyle];
    if(selectedStyle === 'unselected')currentColor = segmentConfig.color.background.unselected;
    else currentColor = segmentConfig.color.background.selected;
  }

</script>

<path
  class="pointer shadow"
  class:transparency={segmentConfig.transparency}
  fill={currentColor}
  stroke={segmentConfig.color.border}
  d={currentState}
  on:click={onClickFn}
  on:mouseenter={() => {
    currentState = states[Thickness.Hover];
  }}
  on:mouseleave={() => {
    currentState = states[selectedStyle];
  }}
  style="transition: all {animationDuration}s;"
/>

<style>
  .pointer {
    cursor: pointer;
  }
  .shadow {
    filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
  }
  .transparency {
    opacity: 0.7;
  }
</style>
