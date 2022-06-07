<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import GlobeViz from "./GlobeViz.svelte";
  import Milestones from './Milestones.svelte';
  import EditableText from "../generic/EditableText.svelte";
  import EditableNumber from "../generic/EditableNumber.svelte";
  import GlobeVizEditor from "./GlobeVizEditor.svelte";

  export let caseStudy: SubTypes.CaseStudy.PageHead;
  export let editable = false;

  const placeholders = {
    name: "Project name",
    established: 2000,
    size: 1234,
    governance: "Adipisicing minim eiusmod eu officia voluptate incididunt officia sit nostrud cupidatat.",
    staff: "12 workers",
    budget: "US$552,479 as direct costs of the protected area, plus part of the support services and enterprise development costs of the co-managing NGO",
    budgetLevel: "Above basic, but less than optimal",
  };

  $: hasMilestones = !!Object.keys(caseStudy.milestones).length;

</script>

<div class="meta-container" class:has-milestones={hasMilestones}>

  <div class="meta-content">

    <div class="meta-grid meta-grid-1">

      <h4>Name</h4>
      <EditableText bind:value={caseStudy.name} placeholder={placeholders.name} {editable} />

      <h4>Established in</h4>
      <EditableNumber bind:value={caseStudy.established} {editable} placeholder={placeholders.established} />

      <h4>Size</h4>
      <EditableNumber bind:value={caseStudy.size} {editable} placeholder={placeholders.size} unitSuffix="km²"/>

      <div class="globe-cell">
        {#if editable}
          <GlobeVizEditor bind:lat={caseStudy.lat} bind:long={caseStudy.long} />
        {:else}
          <GlobeViz lat={caseStudy.lat} long={caseStudy.long} />
        {/if}
      </div>

    </div>

    <div class="meta-grid meta-grid-2">

      <h4>Governance</h4>
      <EditableText bind:value={caseStudy.governance} placeholder={placeholders.governance} {editable} />

      <h4>Staff</h4>
      <EditableText bind:value={caseStudy.staff} placeholder={placeholders.staff} {editable} />

      <h4>Budget</h4>
      <EditableText bind:value={caseStudy.budget} placeholder={placeholders.budget} {editable} />

      <h4>Budget level</h4>
      <EditableText bind:value={caseStudy.budgetLevel} placeholder={placeholders.budgetLevel} {editable} />

    </div>

    {#if editable && !hasMilestones}
      <div class="add-milestones-button">
        <IconButton icon="add" on:click={() => caseStudy.milestones = {'': ['']}} text="Add milestones" />
      </div>
    {/if}

  </div>

  <div class="milestones-container">
    {#if hasMilestones}
      <Milestones bind:milestones={caseStudy.milestones} {editable} />
    {/if}
  </div>

</div>


<style lang="scss">

  .meta-container {
    --bg-color: #{color(deep-blue)};
    position: relative;
    background-color: var(--bg-color);
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.2);
    --ui-color-placeholder: #ffffff55;
  }

  .meta-content {
    width: 1300px;
    margin-left: 124px;
    padding: 35px 20px;
  }

  .meta-grid {
    display: grid;
    grid-template-rows: auto auto;
    grid-auto-flow: column;
    column-gap: 1.5rem;
    color: white;

    &.meta-grid-1 {
      grid-template-columns: 325px 225px 425px 325px;
      margin-bottom: 40px;
      min-height: 110px;
    }

    &.meta-grid-2 {
      grid-template-columns: 325px 325px 325px 325px;
    }

  }

  .meta-grid :global(.editable-content) {
    font-family: 'Bitter';
    background: transparent;
    border: 0;
    padding: 0;
    height: fit-content;
  }

  .meta-grid-1 :global(.editable-content) {
    font-size: 28px;
    line-height: 42px;
  }

  .meta-grid-2 :global(.editable-content) {
    font-size: 18px;
    line-height: 32px;
  }

  .meta-grid > h4 {
    font-family: 'Montserrat';
    font-weight: bold;
    color: color(neutral-bg);
    font-size: 16px;
    line-height: 24px;
    margin: 0;
  }

  .globe-cell {
    position: relative;
    > :global(*) {
      position: absolute;
      transform: translateY(-55%);
    }
  }

  .add-milestones-button {
    margin-bottom: -20px;
    margin-top: 10px;
    --ib-color: #ffffffee;
    --ib-hover-border: 1px solid transparent;
    --ib-hover-bg: #00000011;
  }

  @media screen and (max-width: 768px) {

    .meta-grid > h4 {
      margin-top: 20px;
    }

    .meta-content {
      margin-left:0px;
      padding-top: 150px;
      width: fit-content;
    }

    .meta-grid-1 :global(.editable-content) {
      font-size: 22px;
      line-height: 36px;
      max-width: 23rem;
    }

    .meta-grid-2 :global(.editable-content) {
      font-size: 16px;
      line-height: 28px;
      max-width: 23rem;
    }

    .meta-grid {
      display: block;
      color: white;
      &.meta-grid-1 {
        margin-bottom: 0px;
        min-height: 110px;
      }

      &.meta-grid-2 {
        margin-bottom: 0px;
      }
    }

    .globe-cell {
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translate(-50%, -100px);
    > :global(.globe) {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
      }
    }

  }

</style>