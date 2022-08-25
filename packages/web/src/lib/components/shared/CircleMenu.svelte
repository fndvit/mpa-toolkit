<script context="module" lang="ts">
  export type SegmentType = 'main' | 'secondary' | 'unselected';

  export interface MenuElement {
    percentage: number;
    type: SegmentType;
  }

  const defaultConfig = {
    radius: 80,
    size: 270,
    gap: 2,
    thicknesses: {
      unselected: 18,
      main: 40,
      secondary: 25,
      hover: 45
    } as { [key in SegmentType | 'hover']: number }
  };

  export type CircleConfig = typeof defaultConfig;
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import type { Segment } from './CircularSegment.svelte';
  import { CircularSegment } from '$lib/components/shared';

  export let data: MenuElement[];
  export let config = defaultConfig;
  export let currentPageIndex = 0;
  export let currentSegmentHovered: number = null;

  setContext('circleConfig', config);

  const calcSegments = (menuElements: MenuElement[]) => {
    let currentAngle = 0;
    return menuElements.map<Segment>(({ percentage, type }, i) => {
      const startAngle = currentAngle;
      const endAngle = (currentAngle = startAngle + (360 * percentage) / 100);
      return { startAngle, endAngle, type, tagId: i };
    });
  };

  $: menuSegments = calcSegments(data);
</script>

<svg viewBox="0 0 {config.size} {config.size}">
  {#each menuSegments as segment, i}
    <CircularSegment
      data={segment}
      on:click={() => (currentPageIndex = i)}
      on:mouseenter={() => (currentSegmentHovered = i)}
      on:mouseleave={() => (currentSegmentHovered = null)}
    />
  {/each}
</svg>
