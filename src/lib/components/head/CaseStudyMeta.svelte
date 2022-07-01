<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import GlobeViz from "./GlobeViz.svelte";
  import Milestones from './Milestones.svelte';
  import EditableText from "../generic/EditableText.svelte";
  import EditableNumber from "../generic/EditableNumber.svelte";
  import GlobeVizEditor from "./GlobeVizEditor.svelte";
import KeyLearnings from "../Cards/KeyLearnings.svelte";

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

<div class="meta-container">

  <div class="meta-content">

    <div class="meta-grid meta-grid-1">

      <div class="grid-cell">
        <div class="meta-title">Name</div>
        <EditableText bind:value={caseStudy.name} placeholder={placeholders.name} {editable} />
      </div>

      <div class="grid-cell side-by-side-1">
        <div class="meta-title">Established in</div>
        <EditableNumber bind:value={caseStudy.established} {editable} placeholder={placeholders.established} />
      </div>

      <div class="grid-cell side-by-side-2">
        <div class="meta-title">Size</div>
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
        <div class="meta-title">Governance</div>
        <EditableText bind:value={caseStudy.governance} placeholder={placeholders.governance} {editable} />
      </div>

      <div class="grid-cell">
        <div class="meta-title">Staff</div>
        <EditableText bind:value={caseStudy.staff} placeholder={placeholders.staff} {editable} />
      </div>

      <div class="grid-cell">
        <div class="meta-title">Budget</div>
        <EditableText bind:value={caseStudy.budget} placeholder={placeholders.budget} {editable} />
      </div>

      <div class="grid-cell">
        <div class="meta-title">Budget level</div>
        <EditableText bind:value={caseStudy.budgetLevel} placeholder={placeholders.budgetLevel} {editable} />
      </div>

    </div>

    {#if editable && !hasMilestones}
      <div class="add-milestones-button">
        <IconButton icon="add" on:click={() => caseStudy.milestones = {'': ['']}} text="Add milestones" />
      </div>
    {/if}

  </div>
</div>

{#if hasMilestones}
<div class="meta-container meta-container-milestones">
  <Milestones bind:milestones={caseStudy.milestones} {editable} />
</div>
{/if}

<KeyLearnings/>


<style lang="stylus">

  .meta-container {
    grid-config(page, case-study);

    --ui-color-placeholder: #ffffff55;
    position: relative;
    background-color: $colors.deep-blue;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.2);

    +breakpoint(page, medium) {
      :global(.page-static[data-pagetype="casestudy-with-milestones"]) &.meta-container-milestones,
      :global(.page-static[data-pagetype="casestudy"]) &:not(.meta-container-milestones) {
        margin-bottom: $lifecycle-y-overlap * -1;
        padding-bottom: $lifecycle-y-overlap;
      }
    }

  }

  .meta-container-milestones {
    > :global(.milestones) {
      grid-area: meta;
    }
    background: $colors.dark-blue;
    box-shadow: inset 0px 0px 16px rgba(0, 0, 0, 0.15);
  }

  .meta-content {
    width: auto;
    grid-area: meta;
    padding: 35px 0px;
  }

  .meta-grid {
    display: grid;
    grid-template-rows: auto auto;
    grid-auto-flow: row;
    column-gap: 1.5rem;
    color: white;

    &.meta-grid-1 {
      grid-template-columns: 30% 15% 22.5% 30%;
      min-height: 110px;
      margin-bottom: 45px;
    }

    &.meta-grid-2 {
      grid-template-columns: 22.5% 22.5% 22.5% 22.5%;
    }
  }

  .meta-grid :global(.editable-content) {
    background: transparent;
    border: 0;
    padding: 0;
    height: fit-content;
  }

  .meta-grid-1 :global(.editable-content) {
    typography: p-large-responsive;
  }

  .meta-grid-2 :global(.editable-content) {
    typography: p-responsive;
  }

  .meta-title {
    typography: h5-graphic;
    color: #F9F9F9;
    color: $colors.neutral-bg;
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

  +breakpoint(page, medium) {
    .meta-grid {
      &.meta-grid-1 {
        grid-template-columns: 22.5% 15% 22.5% 30%;
        min-height: 110px;
      }
    }

  }

  +breakpoint(page, small) {

    .grid-cell {
      margin-bottom: 2rem;
    }

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

    .meta-grid {
      display: block;
      color: white;

      &.meta-grid-1 {
        min-height: 110px;
        margin-bottom: 0px;
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