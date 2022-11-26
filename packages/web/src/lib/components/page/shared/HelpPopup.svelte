<script lang="ts">
  export let text: string | boolean = false;
</script>

<div class="help-popup" data-text={text}>
  ?
  <div class="popup-body">
    <slot />
    <slot class="bottom-link" name="bottom-link" />
  </div>
</div>

<style lang="postcss">
  .help-popup {
    font: $f-ui;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    box-shadow: 0 0 5px #000;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0, 3s;
    color: #000;

    &:hover {
      box-shadow: 0 0 10px #000;
    }
  }

  .popup-body {
    position: absolute;
    right: -9px;
    top: calc(100% + 12px);
    cursor: default;
    z-index: $z-tooltip;
    width: calc(100% - 18px);
    max-width: 600px;
    padding: 1rem 1.5rem;
    box-sizing: border-box;
    border-radius: 15px;
    background-color: color($c-neutral-bg alpha(90%));
    color: #000;
    transition: opacity 0.4s ease-out;

    :global(a) {
      color: black;
    }

    > :global(a:last-child) {
      float: right;
      font: $f-ui-link;
      padding: 10px 0 10px 10px;
    }
  }

  .popup-body::before {
    content: '';
    position: absolute;
    bottom: 100%;
    right: 14px;
    width: 0;
    border-bottom: 10px solid alpha($c-neutral-bg, 0.9);
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
  }

  .popup-body::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    height: 20px;
  }

  .popup-body:hover,
  .popup-body::before {
    visibility: visible;
    opacity: 1;
    pointer-events: all;
  }

  .help-popup:not(:hover) .popup-body {
    opacity: 0;
    pointer-events: none;
  }
</style>
