<script context="module" lang='ts'>

  export type Thickness = 'main' | 'secondary' | 'hover' | 'unselected';

  export interface Segment {
    startAngle: number;
    endAngle: number;
    radius: number;
    x: number;
    y: number;
    gap: number;
    thickness: Thickness;
    color: {
      background: {
        selected: string;
        unselected: string;
      }
      border: string;
    }
    transparency: boolean;
  }
</script>
<script lang="ts">
  export let segmentConfig: Segment;
  export let animationDuration: number = 0.3;
  export let selectedStyle: Thickness = 'unselected';

  let hovered = false;

  const describeArc = (segmentConfig: Segment, currentThickness: number) => {
    const thickness = currentThickness; // Need a way to work with enums
    const startAngle = segmentConfig.startAngle + segmentConfig.gap / 2;
    const endAngle = segmentConfig.endAngle - segmentConfig.gap / 2;

    const innerStart = polarToCartesian(segmentConfig.x, segmentConfig.y, segmentConfig.radius, endAngle);
    const innerEnd = polarToCartesian(segmentConfig.x, segmentConfig.y, segmentConfig.radius, startAngle);
    const outerStart = polarToCartesian(segmentConfig.x, segmentConfig.y, segmentConfig.radius + thickness, endAngle);
    const outerEnd = polarToCartesian(segmentConfig.x, segmentConfig.y, segmentConfig.radius + thickness, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
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
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const states: {[key in Thickness]: string} = {
    main: describeArc(segmentConfig, 30),
    secondary: describeArc(segmentConfig, 20),
    unselected: describeArc(segmentConfig, 15),
    hover: describeArc(segmentConfig, 35),
  }

  $: currentState =  states[hovered ? 'hover' : selectedStyle];
  $: currentColor = selectedStyle === 'unselected'
      ? segmentConfig.color.background.unselected
      : segmentConfig.color.background.selected;

</script>

<path
  class="pointer shadow"
  class:transparency={segmentConfig.transparency}
  fill={currentColor}
  stroke={segmentConfig.color.border}
  d={currentState}
  on:click
  on:mouseenter={() => hovered = true}
  on:mouseleave={() => hovered = false}
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
