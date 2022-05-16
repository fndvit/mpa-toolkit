<script context="module" lang='ts'>
  import type { Thickness } from './CircularSegment.svelte';
  export interface CircleMenuColors {
    unselected: string;
    border: string;
  }

  export interface CircleMenuThickness {
    main : number,
    unselected : number,
    secondary : number,
    hover: number
  }

  export interface MenuElement {
    id: number;
    percentage: number;
    group: number;
    type?: Thickness;
    color: string;
  }

</script>
<script lang='ts'>
  import CircularSegment from './CircularSegment.svelte';
  import menuConfig from './circlemenuconfig.json';
  import type { Segment } from './CircularSegment.svelte';

  export let config = menuConfig;
  export let data : MenuElement[];
  export let currentPageIndex : number = config.initialIndex || 0;

  let width: number = config.width || 400;
  let height: number = config.height || 400;

  //is this done before on the cms? is Always the same options?
  const calcSegments = (): Segment[] => {
    let currentAngle = 0;
    return data.map(element => {
      const startAngle = currentAngle;
      const endAngle = currentAngle = startAngle + (360 * element.percentage) / 100;
      return {
        startAngle,
        endAngle,
        thickness: element.type,
        radius: config.radius,
        x: config.x,
        y: config.y,
        gap: config.gap,
        color: {
          background: {
            selected: element.color,
            unselected: config.color.unselected,
          },
          border: 'black'
        },
        transparency: false,
      }
    });
  }

  $: menuSegments = data && calcSegments();

</script>

<svg style="width: {width}; height: {height};">
  {#each menuSegments as segment, i}
    {#if config}
      <CircularSegment
        segmentConfig={segment}
        selectedStyle={data[currentPageIndex].group === data[i].group ? segment.thickness : 'unselected'}
        on:click={() => currentPageIndex = i}
        animationDuration={config.animationDuration}
      />
    {/if}
  {/each}
</svg>

<style>
  svg{
    transition: width 1s, height 1s;
  }
</style>