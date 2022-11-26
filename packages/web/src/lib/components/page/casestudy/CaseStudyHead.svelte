<script lang="ts">
  import type { CaseStudy, PageTag } from '@mpa/db';
  import KeyLearnings from '../chapter/KeyLearnings.svelte';
  import LifeCycle from '../shared/LifeCycle.svelte';
  import CaseStudyMeta from './CaseStudyMeta.svelte';
  import Milestones from './Milestones.svelte';
  import { IconButton } from '$lib/components/generic';

  export let caseStudy: CaseStudy;
  export let tags: PageTag[];
  export let editable = false;

  $: hasMilestones = !!Object.keys(caseStudy.milestones).length;
</script>

<div class="casestudy-head">
  <div class="meta-container">
    <CaseStudyMeta bind:caseStudy {editable} />

    {#if editable && !hasMilestones}
      <div class="add-milestones-button">
        <IconButton icon="add" on:click={() => (caseStudy.milestones = { '': [''] })} text="Add milestones" />
      </div>
    {/if}
  </div>
  {#if hasMilestones}
    <div class="milestones-container">
      <Milestones bind:milestones={caseStudy.milestones} {editable} />
    </div>
  {/if}

  <div class="keylearnings-lifecycle">
    <div class="keylearnings-container">
      <div class="keylearnings-card">
        <KeyLearnings bind:keyLearnings={caseStudy.keyLearnings} {editable} />
      </div>
    </div>

    {#if !editable}
      <div class="lifecycle-container">
        <div class="lifecycle">
          <LifeCycle {tags} />
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .casestudy-head {
    background: $c-secondary-bg;
  }

  .meta-container,
  .milestones-container,
  .keylearnings-lifecycle {
    @mixin grid-config content, case-study;
  }

  .meta-container {
    padding: 35px 0;

    --editable-placeholder-color: #fff5;

    position: relative;
    background-color: $c-deep-blue;
    box-shadow: 0 1px 8px rgb(0 0 0 / 20%);

    > :global(.casestudy-meta) {
      grid-area: meta;
    }
  }

  .lifecycle-container {
    grid-area: lifecycle;
  }

  .lifecycle {
    grid-area: lifecycle;
    position: relative;

    > :global(.lifecycle) {
      position: absolute;
      z-index: $z-lifecycle;
      margin-right: -30px;
      margin-left: 20px;
      margin-top: 40px;
      max-width: 300px;
      box-sizing: border-box;

      @mixin breakpoint content, medium {
        position: static;
        margin: 0;
        max-width: none;
      }
    }
  }

  :global(.page-editor--editing) .keylearnings-lifecycle {
    margin-top: 20px;
  }

  .keylearnings-container {
    grid-area: keylearnings;
    position: relative;
    padding-top: 40px;
    padding-bottom: 40px;
  }

  .keylearnings-card {
    grid-area: keylearnings;
    margin-left: -30px;
  }

  .milestones-container {
    grid-column: 1 / -1;

    > :global(.milestones) {
      grid-area: meta;
    }

    background: $c-dark-blue;
    box-shadow: inset 0 0 16px rgb(0 0 0 / 15%);

    @mixin breakpoint content, medium {
      margin-bottom: calc($lifecycle-overlap * -1);
      padding-bottom: $lifecycle-overlap;
    }
  }

  .add-milestones-button {
    grid-area: meta;
    grid-row: 2;
    margin-bottom: -20px;
    margin-top: 10px;

    --ib-color: #fffe;
    --ib-hover-border: 1px solid transparent;
    --ib-hover-bg: #0001;
  }

  @mixin breakpoint content, medium {
    .keylearnings-card {
      margin-left: 0;
    }

    .lifecycle-container {
      padding-bottom: 40px;
    }

    .keylearnings-container {
      padding-top: 0;
    }
  }

  @mixin breakpoint content, small {
    .meta-container {
      margin-left: 0;
      padding-top: 150px;
      width: fit-content;
    }
  }
</style>
