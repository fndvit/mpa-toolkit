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

      <div class="grid-cell">
        <div class="font-h5-graphic meta-title">Name</div>
        <EditableText bind:value={caseStudy.name} placeholder={placeholders.name} {editable} />
      </div>

      <div class="grid-cell side-by-side-1">
        <div class="font-h5-graphic meta-title">Established in</div>
        <EditableNumber bind:value={caseStudy.established} {editable} placeholder={placeholders.established} />
      </div>

      <div class="grid-cell side-by-side-2">
        <div class="font-h5-graphic meta-title">Size</div>
        <EditableNumber bind:value={caseStudy.size} {editable} placeholder={placeholders.size} unitSuffix="km²"/>
      </div>

      <div class="globe-cell">
        {#if editable}
          <GlobeVizEditor bind:lat={caseStudy.lat} bind:long={caseStudy.long} />
        {:else}
          <GlobeViz lat={caseStudy.lat} long={caseStudy.long} />
        {/if}
      </div>

    </div>

    <div class="meta-grid meta-grid-2">

      <div class="grid-cell">
        <div class="font-h5-graphic meta-title">Governance</div>
        <EditableText bind:value={caseStudy.governance} placeholder={placeholders.governance} {editable} />
      </div>

      <div class="grid-cell">
        <div class="font-h5-graphic meta-title">Staff</div>
        <EditableText bind:value={caseStudy.staff} placeholder={placeholders.staff} {editable} />
      </div>

      <div class="grid-cell">
        <div class="font-h5-graphic meta-title">Budget</div>
        <EditableText bind:value={caseStudy.budget} placeholder={placeholders.budget} {editable} />
      </div>

      <div class="grid-cell">
        <div class="font-h5-graphic meta-title">Budget level</div>
        <EditableText bind:value={caseStudy.budgetLevel} placeholder={placeholders.budgetLevel} {editable} />
      </div>

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

  .grid-cell {
    margin-bottom: 5rem;
  }

  .meta-container {
    --bg-color: #13487C;
    position: relative;
    background-color: var(--bg-color);
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.2);
    --ui-color-placeholder: #ffffff55;
  }

  .meta-content {
    width: auto;
    margin-left: 124px;
    padding: 35px 20px;
  }

  .meta-grid {
    display: grid;
    grid-template-rows: auto auto;
    grid-auto-flow: row;
    column-gap: 1.5rem;
    color: white;

    &.meta-grid-1 {
      grid-template-columns: 20% 12% 28% 20%;
      min-height: 110px;
    }

    &.meta-grid-2 {
      grid-template-columns: 20% 20% 20% 20%;
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

  .meta-title {
    color: #F9F9F9;
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

  @media screen and (max-width: 1024px) {

    .side-by-side-1 {
      display: inline-block;
      margin-right: 75px;
    }

    .side-by-side-2 {
      display: inline-block;
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