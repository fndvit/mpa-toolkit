<script lang="ts">

  export let section: string = "[redacted]";

  const defaultText = `Learn about the <b>` + section + `</b>`;
  const expandedText = 'Read less';

  let text = defaultText;
  let arrowD = 1;


  const click = () => { text = text === defaultText ? expandedText : defaultText; arrowD *= -1; };

</script>

<div class="external-container">
  <div class="internal-container" on:click={click}>
    <svg width="13" height="8" viewBox="0 0 13 8" fill="none" transform="scale(1, {arrowD})" class="arrow">
      <path d="M0.630249 1L6.36134 6.5L12.0924 1" stroke="#2A2A2A" stroke-width="1.5"/>
    </svg>
    {@html text}
  </div>
</div>


<style>

  .arrow {
    margin-right: 5px;
  }

  .external-container {
    border-top: 0.5px solid #D9D9D9;
    width: 640px;
  }

  .internal-container {
    position: relative;
    display: inline-block;
    height: 40px;
    background: #F9F9F9;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
    border-radius: 0px 0px 20px 20px;
    font-size: 12px;
    line-height: 40px;
    font-family: 'Montserrat';
    cursor: pointer;
    text-align: center;
    vertical-align: middle;
    margin-bottom: 40px;
    padding-left: 15px;
    padding-right: 20px;
  }

  .internal-container:hover {
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.30);
  }

</style>
