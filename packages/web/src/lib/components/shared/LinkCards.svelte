<script lang="ts">
  import type { LinkCardData } from '@mpa/db';
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import CardHeading from './CardHeading.svelte';
  import LinkCardLink from './LinkCardLink.svelte';
  import { IconButton } from '$lib/components/generic';

  export let cards: LinkCardData[];
  export let title = '';
  export let editable = false;
  export let controls: SvelteNodeViewControls = null;

  const MAX_CARDS = 5;

  const onClickAddCard = () => {
    cards.push({} as LinkCardData);
    cards = cards;
  };

  const onClickDeleteCard = (index: number) => {
    cards.splice(index, 1);
    cards = cards;
    if (cards.length === 0) {
      controls.delete();
    }
  };
</script>

<div class="linkcards">
  <CardHeading bind:text={title} {editable} />

  <ul class="linkcards-links">
    {#each cards as card, i}
      <li class="card">
        <LinkCardLink bind:card {editable} on:delete={() => onClickDeleteCard(i)} />
      </li>
    {/each}
  </ul>
  {#if editable}
    <div class="editor-buttons">
      <div class="cont">
        {cards.length} / {MAX_CARDS}
      </div>
      <IconButton icon="add" on:click={onClickAddCard} disabled={cards.length >= MAX_CARDS} />
    </div>
  {/if}
</div>

<style lang="postcss">
  .linkcards {
    --editable-caret: black;
    --ib-icon-bg: #0002;
    --ib-hover-bg: #0002;
    --ib-hover-border-color: #0002;
    --ib-active-bg: #fff7;

    padding: 1.25rem 1.375rem;
    background-color: $c-neutral-bg;
    filter: drop-shadow(0 3px 8px rgb(0 0 0 / 15%));
    border-radius: 20px;

    :global(.heading) {
      @mixin font-responsive h5;
    }

    :global(.page-editor--editing) & {
      --editable-outline: 1px solid #0004;

      &:hover :global(.editable-content),
      :global(.editable-content.focused) {
        --editable-bg: white;

        box-shadow: 0 0 0 1px #0001;
      }

      &::before {
        /* to make hoverstate bigger for the controls */
        content: '';
        position: absolute;
        left: 100%;
        top: 0;
        height: 100%;
        width: 75px;
      }
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      border-bottom: 1px solid $c-neutral-light;
    }

    li:last-child {
      border-bottom: none;
    }
  }

  .linkcards-links {
    display: flex;
    flex-direction: column;
    column-gap: 1rem;
    margin-top: 1.8rem;
  }

  .editor-buttons {
    position: absolute;
    top: 100%;
    left: 50%;
    z-index: 1;
    background: $c-neutral-bg;
    display: flex;
    justify-content: right;
    padding: 0.1rem 1rem 0.4rem 1.8rem;
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;
    align-items: center;
    column-gap: 1rem;
    transform: translateX(-50%);

    .linkcards:not(:hover) & {
      display: none;
    }
  }
</style>
