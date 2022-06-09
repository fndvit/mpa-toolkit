<script context="module" lang='ts'>
  import type { CircleConfig, SegmentType } from "$lib/components/CircleMenu.svelte";

  export interface Segment {
    tagId: number;
    startAngle: number;
    endAngle: number;
    type: SegmentType;
  }

</script>
<script lang="ts">
  import { getContext } from "svelte";

  export let data: Segment;

  const circleConfig = getContext<CircleConfig>('circleConfig');

  const describeArc = (segment: Segment, type: keyof CircleConfig['thicknesses']) => {
    const thickness = circleConfig.thicknesses[type];
    const startAngle = segment.startAngle + circleConfig.gap / 2;
    const endAngle = segment.endAngle - circleConfig.gap / 2;
    const center = circleConfig.size / 2;

    const innerStart = polarToCartesian(center, center, circleConfig.radius, endAngle);
    const innerEnd = polarToCartesian(center, center, circleConfig.radius, startAngle);
    const outerStart = polarToCartesian(center, center, circleConfig.radius + thickness, endAngle);
    const outerEnd = polarToCartesian(center, center, circleConfig.radius + thickness, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
      'M',
      outerStart.x,
      outerStart.y,
      'A',
      circleConfig.radius + thickness,
      circleConfig.radius + thickness,
      0,
      largeArcFlag,
      0,
      outerEnd.x,
      outerEnd.y,
      'L',
      innerEnd.x,
      innerEnd.y,
      'A',
      circleConfig.radius,
      circleConfig.radius,
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

  let hovered = false;

  $: arc = describeArc(data, data.type);
  $: hoverArc = describeArc(data, 'hover');

</script>

<path
  class="segment segment__{data.type}"
  d={hovered ? hoverArc : arc}
  on:click
  on:mouseenter={() => hovered = true}
  on:mouseleave={() => hovered = false}
  on:mouseenter
  on:mouseleave
/>

<style lang="stylus">
  .segment {
    cursor: pointer;
  }

  .segment__main,
  .segment__secondary {
    fill: $colors.highlight-1;
  }
  .segment__secondary { opacity: 0.5;}
  .segment__unselected { fill: #FFFFFF80; }

  path {
    transition: all 0.3s;
  }
</style>
