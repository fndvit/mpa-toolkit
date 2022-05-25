<script lang="ts">
  import landingLifecycle from '$lib/assets/landing-lifecycle.jpg';
  import Cards from './Cards/Cards.svelte';
  import CircleMenu, { MenuElement, SegmentType } from './CircleMenu.svelte';

  let currentPageIndex = 0;
  let menuData;

  const cardBlocks = [
    {
      heading: '1. Identify the problem',
      body: 'What are the forecast impacts of climate change on the MPA? MPAs are nature-based solutions to climate change, but MPAs, the species and habitats they protect and the communities and livelihoos associated with them are also vulnerable to the impacts of climate change.'
    },
    {
      heading: '2. Understand your system',
      body: 'How to assess the level of threat to the MPA, its species, habitats, associated communities and livelihoods? A vulnerability assessment can guide planning for climate resilience and adaptation.'
    },
    {
      heading: '3A. Engaging stakeholders',
      body: 'How will climate change impact communities associated with MPAs and their livelihoods? To build climate change resilience, ensuring gender equity and indigenous engagement in marine natural resource management are more important than ever. MPA managers can support national and international policy development related to climate change.'
    },
    {
      heading: '3B. Setting goals and objectives',
      body: 'How to manage adaptively for climate change resilience? Restricting activities at a local scale does nothing to stop the threat of climate change, but it could increase resilience to climate change. Each MPA is unique and so are the most appropriate management actions. They will be driven by limits on political commitments, available resources, current understanding, time, and energy.'
    },
    {
      heading: '3C. Designing MPAs',
      body: "How can MPAs adapt to climate change? What actions can be taken for adaptation and mitigation? To be truly adaptive, the conceptual framing of MPAs needs to incorporate responsiveness to change. Species and ecological communities within an MPA have some capacity to adapt as changing conditions will promote new assemblages over time. Consider prioritizing the protection of 'future habitat' (establish MPAs today where habitats and species are likely to shift in the future, plan for dynamic MPAs to move as species/habitats move) and protecting areas predicted to experience relatively low impacts from climate change."
    },
    {
      heading: '4. Implementation',
      body: 'What management actions and adaptation strategies can MPA managers undertake to increase resilience, therefore minimising projected climate change impacts on MPAs as well as the communities and livelihoods associated with them? MPA management may steer change along the most positive trajectory possible. MPA managers have a role to play in helping lessen the impacts of climate change. MPAs can be managed to build resilience, including by reducing non-climate stressors. Local action planning can assist MPA stakeholders with developing adaptation strategies.'
    },
    {
      heading: '5. Future proofing and adapting',
      body: 'What to monitor and how? How do we account for uncertainty surrounding climate change projections in management decision-making? Monitoring the impacts of climate change is rarely a priority because the chance that local actions will abate the threat are low. In general, it is far more important to monitor things that tell us about threats that we can manage, such as poaching or nutrients. In turn, there is evidence that managing these local threats can improve the resilience of marine ecosystems to climate change impacts.'
    }
  ];

  const LIFECYCLE_CONFIG = [20, 20, 10, 5, 5, 10, 30];

  $: if(currentPageIndex >= 0)
      menuData = LIFECYCLE_CONFIG.map<MenuElement>((percentage, i) => {
        return {
          percentage,
          type: currentPageIndex === i ? 'main' : 'unselected'
        };
      });
</script>

<div class="container" style="background-image: url({landingLifecycle});">
  <div class="column1">
    <h2>What's the <b>MPA management cycle</b></h2>
  </div>
  <div class="column2">
    <Cards cards={cardBlocks} bind:currentPageIndex={currentPageIndex} />
  </div>
  <div class="column3">
    <div class="circle-menu">
      <CircleMenu data={menuData} bind:currentPageIndex={currentPageIndex}/>
    </div>
  </div>
</div>

<style lang="scss">
  .container {
    width: 100%;
    height: 800px;
    background-size: cover;
    grid-template-rows: 30%;
    grid-template-columns: 50% 50%;
    grid-template-areas:
    "title circlemenu"
    "textslide circlemenu";
    display: grid;
    font-family: 'Montserrat';
    overflow: hidden;
    h2 {
      font-size: 48px;
    }

    .column1 {
      margin-top: 149px;
      margin-left: 120px;
      grid-area: title;
    }
    .column2 {
      margin-top: 149px;
      margin-left: 120px;
      grid-area: textslide;
    }

    .column3 {
      margin: auto;
      grid-area: circlemenu;
    }

    .circle-menu{
      width: 800px;
      height: 800px;
    }

    @media (max-width: 1575px){
      .circle-menu{
        width: 700px;
        height: 700px;
      }
    }

    @media (max-width: 1575px){
      .circle-menu{
        width: 700px;
        height: 700px;
      }
    }


  }
  @media (max-width: 1280px){
    .container {
      width: 100%;
      height: auto;
      display: flex;
      flex-flow: column;
      text-align: center;
      .column1{
        order: 1;
        margin: auto;
      }
      .column2{
        order: 3;
        margin: 0;
        padding: 20px;
      }
      .column3{
        order: 2;
      }
    }

  }


</style>
