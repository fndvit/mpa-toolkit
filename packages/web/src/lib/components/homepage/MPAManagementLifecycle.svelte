<script lang="ts">
  import { slugify } from '@mpa/utils';
  import landingLifecycle from '$lib/assets/landing-lifecycle.jpg';
  import { Cards, CircleMenu } from '$lib/components/shared';
  import type { MenuElement } from '$lib/components/shared/CircleMenu.svelte';

  const cardBlocks = [
    {
      heading: '1. Problem-scoping',
      body: 'The MPA life cycle begins as a response to threats to an area - whether they be to biodiversity or marine productivity. An “MPA idea” is developed to address those challenges or threats but it must have a clear purpose in its design and be “fit-for-purpose” in its approach to those issues.',
      type: 'default'
    },
    {
      heading: '2. Understand your system',
      body: 'Every MPA must be crafted taking into consideration the environmental, social, and political systems in which the MPA is located or will be located. Collecting information on conditions and trends in the environment, habitats, and species in the area, understanding human uses and values attached to the area, and examining existing management as well as broader governance frameworks and stakeholder composition will be essential.',
      type: 'default'
    },
    {
      heading: '3A. Engage stakeholders',
      body: 'To ensure that planning is participatory, stakeholders must be engaged, but even more importantly, identified. They are not always the loudest voices in the room, or the most visible. Establishing a stakeholder engagement plan is the best way to allocate time and resources to stakeholder engagement.Engaging stakeholders early in the MPA planning process, even before actual planning begins, can help ensure there will be lasting buy-in for the MPA.',
      type: 'default'
    },
    {
      heading: '3B. Set goals and objectives',
      body: 'A visioning exercise or process is meant to define the broader goal of the MPA  as well as the very site-specific objectives that the management regime will attempt to fulfil. Communicating the vision, goals and objectives will also be important at this stage, to ensure that miscommunication and deliberate anti-MPA propaganda do not derail the MPA planning and implementation.',
      type: 'default'
    },
    {
      heading: '3C. Designing MPAs',
      body: "The final stage of planning is contingent on the previous two, but is often the only planning done. A strategy is crafted that can include the allocation of human and financial resources to developing MPA plans, decreeing protected areas (including accompanying legislation if needed), managing uses of the area, and undertaking surveillance and public education to maintain compliance with regulations.",
      type: 'default'
    },
    {
      heading: '4. Management',
      body: 'A key part of MPA planning is ensuring that capacity is built to manage and fund it over the long term. Management must aim for effectiveness, and include adequate tracking to monitor the completion of goals and objectives.',
      type: 'default'
    },
    {
      heading: '5. Adaptation',
      body: 'Everything changes over time, but effective management of an MPA includes adapting to changes from ecosystem to governance. Adaptive management completes the circle of the management cycle and is key to helping the MPA deliver benefits to the ocean and the humans who rely on it.',
      type: 'default'
    }
  ];

  const LIFECYCLE_CONFIG = [20, 20, 10, 5, 5, 10, 30];

  const tags = [
    { tag: 'Identify the problem', sentence: 'identifying the problem' },
    { tag: 'Understand your system', sentence: 'understanding your system' },
    { tag: 'Engage stakeholders', sentence: 'engaging stakeholders' },
    { tag: 'Set goals and objectives', sentence: 'setting goals and objectives' },
    { tag: 'Designing', sentence: 'designing MPAs' },
    { tag: 'Implementation', sentence: 'implementing MPAs' },
    { tag: 'Future proofing and adaptation', sentence: 'future proofing and adapting' }
  ];

  let currentPageIndex = 0;
  let currentTagHovered: number;
  let xCoord: number;
  let yCoord: number;

  $: menuData =
    currentPageIndex >= 0 &&
    LIFECYCLE_CONFIG.map<MenuElement>((percentage, i) => ({
      percentage,
      type: currentPageIndex === i ? 'main' : 'unselected'
    }));

  $: href = `/tag/${slugify(tags[currentPageIndex].tag)}/`;
</script>

<div class="landing-lifecycle" style="background-image: url({landingLifecycle});">
  <div class="column1">
    <h2>What's the <b>MPA life cycle</b></h2>
  </div>
  <div class="column2">
    <Cards cards={cardBlocks} progress={false} bind:currentPageIndex />
    <a {href} class="cta">
      <button tabindex="0">
        <div>Learn about <b>{tags[currentPageIndex].sentence}</b></div>
        <svg width="12" height="21" viewBox="0 0 12 21" fill="none">
          <path d="M1.39624 19.9412L9.95787 10.4118L1.39624 0.882338" stroke="#2A2A2A" stroke-width="2.4" />
        </svg>
      </button>
    </a>
  </div>
  <div class="column3">
    <div class="circle-menu" on:mousemove={e => ([xCoord, yCoord] = [e.offsetX, e.offsetY])}>
      {#if currentTagHovered != null}
        <div class="tooltip" style="--x-position: {xCoord}px; --y-position: {yCoord}px;">
          {tags[currentTagHovered].tag}
        </div>
      {/if}
      <CircleMenu data={menuData} bind:currentSegmentHovered={currentTagHovered} bind:currentPageIndex />
    </div>
  </div>
</div>

<style lang="postcss">
  .tooltip {
    --tooltip-clamp-width: 175px;
    @mixin font-responsive h4;

    display: block;
    position: absolute;
    pointer-events: none;
    top: var(--y-position);
    left: clamp(var(--tooltip-clamp-width), var(--x-position), calc(100% - var(--tooltip-clamp-width)));
    transform: translateX(-50%);
    z-index: 10;
    background-color: $c-highlight-1;
    padding: 15px;
    border-radius: 25px;
    box-shadow: 0 0 8px rgba(0 / 0 / 0 / 25%);
    white-space: nowrap;
    animation: fade-in ease-in-out 0.5s;
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  .circle-menu {
    position: relative;
  }

  .landing-lifecycle {
    width: 100%;
    height: 900px;
    background-size: cover;
    grid-template:
      'title circlemenu' 30%
      'textslide circlemenu'
      / 50% 50%;
    display: grid;
    overflow: hidden;
    padding: 0 var(--page-padding);
    box-sizing: border-box;

    .cta {
      text-decoration: none;

      svg path {
        stroke: $c-neutral-black;
      }

      button {
        @mixin font-responsive h4;

        font-weight: 400 !important;
        font-size: 1rem !important;
        display: flex;
        gap: 0.75rem;
        border: none;
        background: $c-highlight-1;
        box-shadow: 0 3px 16px rgb(0 0 0 / 15%);
        border-radius: 24px;
        padding: 0.8rem 1.5rem 0.8rem 1.35rem;
        cursor: pointer;
        margin: 3rem 0 2rem;
        align-items: center;

        &:hover {
          filter: brightness(105%);
        }
      }
    }

    h2 {
      @mixin font-responsive h2;
    }

    .column1 {
      margin-top: 149px;
      max-width: 400px;
      grid-area: title;
    }

    .column2 {
      margin-top: 100px;
      grid-area: textslide;
    }

    .column3 {
      margin: auto;
      grid-area: circlemenu;
    }

    .circle-menu {
      width: 700px;
      height: 700px;
    }

    @media (max-width: 1280px) {
      .circle-menu {
        width: 600px;
        height: 600px;
      }
    }
  }

  @media (max-width: 1024px) {
    .tooltip {
      display: none;
    }

    .landing-lifecycle {
      width: 100%;
      height: auto;
      display: flex;
      flex-flow: column;

      .column1 {
        order: 1;
        max-width: none;
        margin: auto;
      }

      .column2 {
        order: 3;
        margin: 0;
        padding-bottom: 20px;
      }

      .column3 {
        order: 2;
      }

      .circle-menu {
        width: 600px;
        height: 600px;
      }
    }
  }

  @media (max-width: 625px) {
    .landing-lifecycle {
      .circle-menu {
        width: 500px;
        height: 500px;
      }
    }
  }

  @media (max-width: 425px) {
    .landing-lifecycle {
      .circle-menu {
        width: 300px;
        height: 300px;
      }
    }
  }

  @mixin breakpoint content, medium {
    button {
      padding: 0.55rem 0.95rem 0.45rem 0.85rem;
    }
  }
</style>
