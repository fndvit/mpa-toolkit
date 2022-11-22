<script lang="ts">
  import { slugify } from '@mpa/utils';
  import landingLifecycle from '$lib/assets/landing-lifecycle.jpg';
  import { Cards, CircleMenu } from '$lib/components/shared';
  import type { MenuElement } from '$lib/components/shared/CircleMenu.svelte';

  const cardBlocks = [
    {
      heading: '1. Identify the problem',
      body: 'What are the forecast impacts of climate change on the MPA? MPAs are nature-based solutions to climate change, but MPAs, the species and habitats they protect and the communities and livelihoos associated with them are also vulnerable to the impacts of climate change.',
      type: 'default'
    },
    {
      heading: '2. Understand your system',
      body: 'How to assess the level of threat to the MPA, its species, habitats, associated communities and livelihoods? A vulnerability assessment can guide planning for climate resilience and adaptation.',
      type: 'default'
    },
    {
      heading: '3A. Engage stakeholders',
      body: 'How will climate change impact communities associated with MPAs and their livelihoods? To build climate change resilience, ensuring gender equity and indigenous engagement in marine natural resource management are more important than ever. MPA managers can support national and international policy development related to climate change.',
      type: 'default'
    },
    {
      heading: '3B. Set goals and objectives',
      body: 'How to manage adaptively for climate change resilience? Restricting activities at a local scale does nothing to stop the threat of climate change, but it could increase resilience to climate change. Each MPA is unique and so are the most appropriate management actions. They will be driven by limits on political commitments, available resources, current understanding, time, and energy.',
      type: 'default'
    },
    {
      heading: '3C. Designing MPAs',
      body: "How can MPAs adapt to climate change? What actions can be taken for adaptation and mitigation? To be truly adaptive, the conceptual framing of MPAs needs to incorporate responsiveness to change. Species and ecological communities within an MPA have some capacity to adapt as changing conditions will promote new assemblages over time. Consider prioritizing the protection of 'future habitat' (establish MPAs today where habitats and species are likely to shift in the future, plan for dynamic MPAs to move as species/habitats move) and protecting areas predicted to experience relatively low impacts from climate change.",
      type: 'default'
    },
    {
      heading: '4. Implementation',
      body: 'What management actions and adaptation strategies can MPA managers undertake to increase resilience, therefore minimising projected climate change impacts on MPAs as well as the communities and livelihoods associated with them? MPA management may steer change along the most positive trajectory possible. MPA managers have a role to play in helping lessen the impacts of climate change. MPAs can be managed to build resilience, including by reducing non-climate stressors. Local action planning can assist MPA stakeholders with developing adaptation strategies.',
      type: 'default'
    },
    {
      heading: '5. Future proofing and adaptation',
      body: 'What to monitor and how? How do we account for uncertainty surrounding climate change projections in management decision-making? Monitoring the impacts of climate change is rarely a priority because the chance that local actions will abate the threat are low. In general, it is far more important to monitor things that tell us about threats that we can manage, such as poaching or nutrients. In turn, there is evidence that managing these local threats can improve the resilience of marine ecosystems to climate change impacts.',
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
    <div class="circle-menu">
      <CircleMenu data={menuData} bind:currentPageIndex />
    </div>
  </div>
</div>

<style lang="stylus">

  .landing-lifecycle {
    width: 100%;
    height: 900px;
    background-size: cover;
    grid-template-rows: 30%;
    grid-template-columns: 50% 50%;
    grid-template-areas:
      "title circlemenu"\
      "textslide circlemenu";
    display: grid;
    overflow: hidden;
    padding: 0 var(--page-padding);
    box-sizing: border-box;


    .cta {
      text-decoration: none;

      svg path {
        stroke: $colors.neutral-black;
      }

      button {
        typography: h4-responsive;
        font-weight: 400 !important;
        font-size: 1rem !important;
        display: flex;
        gap: 0.75rem;
        border: none;
        background: $colors.highlight-1;
        box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
        border-radius: 24px;
        padding: 0.8rem 1.5rem 0.8rem 1.35rem;
        cursor: pointer;
        margin: 3rem 0rem 2rem;
        align-items: center;

        &:hover {
          filter: brightness(105%);
        }
      }
    }

    h2 {
      typography: h2-responsive;
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
      width: 800px;
      height: 800px;
    }

    @media (max-width: 1575px) {
      .circle-menu {
        width: 700px;
        height: 700px;
      }
    }
  }

  @media (max-width: 1280px) {

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
    }
  }

  @media(max-width: 625px) {
    .landing-lifecycle {
      .circle-menu {
        width: 500px;
        height: 500px;
      }
    }
  }

  @media(max-width: 425px) {
    .landing-lifecycle {
      .circle-menu {
        width: 300px;
        height: 300px;
      }
    }
  }

  +breakpoint(page, medium) {
    button {
      padding: 0.55rem 0.95rem 0.45rem 0.85rem;
    }
  }


</style>
