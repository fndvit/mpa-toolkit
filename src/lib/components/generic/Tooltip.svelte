<script lang="ts">
  export let text: string = null;
</script>

<div class="tooltip" data-text={text} />


<style lang="scss">

  .tooltip {
    --arrow-size: 8px;
    --ib-tooltip-bg: #fafafa;
    --ib-tooltip-border: #49499276;
    position: absolute;
    top: calc(100% + var(--arrow-size));
    left: 50%;
    pointer-events: none;
    filter: drop-shadow(0px 1px 3px #00000044);
    font-family: 'Montserrat';
    font-size: 13px;
    line-height: 16px;
    max-width: 150px;
    white-space: normal;
    color: black;
    text-align: center;


    &:before,
    &:after {
      content: attr(data-text);
      display: block;
      width: max-content;
      max-width: 100%;
      padding: calc(6px + var(--arrow-size)) 8px 6px;
      background: var(--ib-tooltip-bg);
      transform: translateX(-50%);
      clip-path: polygon(
        1px calc(var(--arrow-size) + 1px),
        calc(50% - var(--arrow-size) + 0.41px) calc(var(--arrow-size) + 1px),
        50% 1.41px,
        calc(50% + var(--arrow-size) - 0.41px) calc(var(--arrow-size) + 1px),
        calc(100% - 1px) calc(var(--arrow-size) + 1px),
        calc(100% - 1px) calc(100% - 1px),
        1px calc(100% - 1px)
      );
    }
    &:before {
      position: absolute;
      background: var(--ib-tooltip-border);
      clip-path: polygon(
        0 var(--arrow-size),
        calc(50% - var(--arrow-size)) var(--arrow-size),
        50% 0,
        calc(50% + var(--arrow-size)) var(--arrow-size),
        100% var(--arrow-size),
        100% 100%,
        0 100%
      );
    }
    transition: all 100ms 0.2s;
    opacity: 1;
    transform: translateY(0);
    :global(.tooltip-hover-el:not(:hover)) & {
      opacity: 0;
      visibility: hidden;
      transform: translateY(-50%);
      transition: all 100ms 0s;
    }
  }

</style>
