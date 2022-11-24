<script>
	let collapsed = false;
</script>

<div class:collapsed>
	<div class="block">Block 1</div>
	<div class="block">Block 2</div>
	<div class="block">Block 3</div>
	<div class="collapse-point"/>
	<div class="block">Block 4</div>
	<div class="block">Block 5</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
	<button class="expand-button" on:click={() => collapsed = !collapsed}>
		{collapsed ? 'Expand'  : 'Collapse'}
	</button>
</div>

<div>
  <div class="block">Block 4</div>
	<div class="block">Block 5</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
  <div class="block">Block 4</div>
	<div class="block">Block 5</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
	<div class="block">Block 6</div>
</div>
<style>
	.block {
		background: #ff9999;
		padding: 20px;
		margin-bottom: 2px;
	}

	.collapse-point {
		display: none;
	}

	.collapsed > .collapse-point ~ *:not(.expand-button) {
		display: none;
	}

</style>