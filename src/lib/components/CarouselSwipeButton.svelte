<script lang="ts">
  export let clickEvent;
  export let type: "next" | "prev";
</script>

<div class="circle-button" tabindex="0" on:click={clickEvent}>
  <svg class={type === "prev" ? "svg-left" : "svg-right"} width="12" height="20" viewBox="0 0 12 20" fill="none">
    <path d="M1.1814 19L9.81849 10L1.1814 1" stroke="#2A2A2A" stroke-width="2.4"/>
  </svg>
</div>

<style>
  .circle-button {
    display: flex;
    flex-direction: row;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    background: #F9F9F9;
    opacity: 0.5;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .svg-left {
    transform: scaleX(-1) translateX(2px);
  }

  .svg-right {
    transform: translateX(2px);
  }

  .circle-button:hover {
    opacity: 1;
  }

</style>