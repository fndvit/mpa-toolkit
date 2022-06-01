<script lang="ts">
  export let text: string | boolean = false;
</script>

<div class="container" data-text={text}>
  <div class="icon">
    <slot name="icon"/>
  </div>
  <div class="popup-body">
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
  }
	.container {
    position: relative;
    z-index: 2;
    display: block;
  }

  .popup-body {
    display: hidden;
    opacity: 0;
    pointer-events: none;
    transition: .2s ease-out;
    transform: translate(-50%, 5px);
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
    color: #000;
    text-align: center;
    font-size: 14px;
    line-height: 1.2;
    transition: 0.5s ease-out
  }

  .icon:hover ~ .popup-body{
      visibility: visible !important;
      opacity: 1;
      transform: translate(-50%, 0)
  }
  .popup-body:hover {
    visibility: visible !important;
    opacity: 1;
    transform: translate(-50%, 0)
   }
</style>