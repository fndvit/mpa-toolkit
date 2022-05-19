<div class="spinner"></div>

<style>
.spinner {
  --color: #333;
  --size: 26px;
  --border-width: 3px;
  display: inline-block;
  position: relative;
  width: var(--size);
  height: var(--size);
}
.spinner:after {
  --inner-size: calc(var(--size) * (3/4));
  content: " ";
  display: block;
  width: var(--inner-size);
  height: var(--inner-size);
  border-radius: 50%;
  border: var(--border-width) solid var(--color);
  border-color: var(--color) transparent var(--color) transparent;
  animation: lds-dual-ring 1.2s linear infinite;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>