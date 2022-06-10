<script lang="ts">
  export let text: string | boolean = false;
</script>

<div class="help-popup" data-text={text}>
  ?
  <div class="popup-body">
    <slot/>
    <slot class="bottom-link" name="bottom-link" />
  </div>
</div>


<style lang="stylus">

	.help-popup {
    position: relative;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    box-shadow: 0px 0px 5px #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0,3s;
    color: #000000;
    &:hover {
      box-shadow: 0px 0px 10px #000000;
    }
  }

  .popup-body {
    position: absolute;
    cursor: default;
    right: 0;
    top: calc(100% + 5px);
    z-index: 10;
    width: 270px;
    padding: 1rem 1.5rem;
    box-sizing: border-box;
    border-radius: 15px;
    background-color: var(--popup-bg-color, alpha($colors.neutral-bg, 0.9));
    color: #000;
    font-size: 14px;
    line-height: 1.2;
    transition: .4s ease-out;

    > :global(a:last-child) {
      float: right;
      font-weight: 700;
      font-size: 12px;
      padding: 10px 0 10px 10px;
    }

    .help-popup:not(:hover) & {
      opacity: 0;
      pointer-events: none;
    }

    +breakpoint(page, medium){
      width: 435px;
    }

    +breakpoint(page, xs){
      width: 270px;
    }
  }

  .popup-body:before {
    content: '';
    position: absolute;
    bottom: 99.3%;
    right: 5px;
    width: 0;
    border-bottom: 10px solid var(--popup-bg-color, alpha($colors.neutral-bg, 0.9));
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
  }

  .popup-body:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    height: 20px;
  }

  .popup-body:hover,
  .popup-body:before {
    visibility: visible;
    opacity: 1;
    pointer-events: all;
   }
</style>