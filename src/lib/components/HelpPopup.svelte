<script lang="ts">
  export let text: string | boolean = false;
</script>

<div class="container" data-text={text}>
  <div class="icon">
    <slot name="icon"/>
  </div>
  <div class="popup-body">
    <div class="arrow"/>
    <slot name="info"/>
  </div>
</div>


<style lang="scss">
  :root{
    --bg-color: #F9F9F9E5;
    --width: 100%;
    --min-width: 70px;
    --max-width: 250px;
    --bottom: 100%;
    --left: 50%;
    --color: #000;
  }
	.container {
    position: relative;
    z-index: 2;
    display: block;
  }

  .popup-body,
  .arrow {
    display: hidden;
    opacity: 0;
    transition: .4s ease-out;
  }

  .popup-body {
    position: absolute;
    bottom: var(--bottom);
    left: var(--left);
    margin-bottom: 5px;
    padding: 7px;
    width: var(--width);
    min-width: var(--min-width);
    max-width: var(--max-width);
    border-radius: 15px;
    background-color: var(--bg-color);
    color: var(--color);
    text-align: center;
    font-size: 14px;
    line-height: 1.2;
    pointer-events: none;
  }

  .arrow{
    position: absolute;
    top: -7px;
    right: 17px;
    width: 0;
    border-bottom: 5px solid var(--bg-color);
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    transform: scale(2);
  }
  .icon:hover ~ .popup-body{
      visibility: visible !important;
      opacity: 1;
  }
  .popup-body:hover,
  .arrow {
    visibility: visible !important;
    opacity: 1;
    pointer-events: all;
   }
</style>