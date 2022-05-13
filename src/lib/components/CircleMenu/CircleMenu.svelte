<script context="module" lang='ts'>
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
    type?: string;
    color: string;
  }

</script>
<script lang='ts'>
  import CircularSegment from './CircularSegment.svelte';
  import menuConfig from './circlemenuconfig.json';
  import type { Segment } from './CircularSegment.svelte';
  import { Thickness } from './CircularSegment.svelte';

  export let config = menuConfig.standardView;
  export let data : MenuElement[];
  export let currentPageIndex : number = config.initialIndex || 0;

  let width: number = config.width || 400;
  let height: number = config.height || 400;

  //is this done before on the cms? is Always the same options?
  const calcSegments = () => {
    let menuSegments: Segment[] = [];
    let currentAngle = 0;
    data.forEach(element => {
      let segment: Segment =  {
        startAngle: currentAngle,
        endAngle: currentAngle + (360 * element.percentage) / 100,
        radius: config.radius,
        thickness: config.thickness,
        x: config.x,
        y: config.y,
        gap: config.gap,
        type: element.type,
        color: {
          background: {
            selected: element.color,
            unselected: config.color.unselected,
          },
          border: config.color.border
        },
        transparency: false,
      }
      currentAngle = segment.endAngle;
      menuSegments.push(segment);
    });
    return menuSegments
  }

  let handleSegmentClick = (index : number) => {
    currentPageIndex = index;
  }

  $: menuSegments = data && calcSegments();

</script>


<svg style="width: {width}; height: {height};">
  {#each menuSegments as segment, i}
    {#if config}
      <CircularSegment
        segmentConfig = {segment}
        selectedStyle = {data[currentPageIndex].group === data[i].group? (segment.type): Thickness.Unselected}
        onClickFn = {() => {handleSegmentClick(i)}}
        animationDuration = {config.animationDuration}
      />
    {/if}
  {/each}
</svg>

<style>
  svg{
    transition: width 1s, height 1s;
  }
</style>