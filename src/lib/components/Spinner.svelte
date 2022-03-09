<div class="spinner"></div>

<style>
.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
}
.spinner:after {
  content: " ";
  display: block;
  width: 26px;
  height: 26px;
  margin: 4px;
  border-radius: 50%;
  border: 3px solid var(--color);
  border-color: var(--color) transparent var(--color) transparent;
  animation: lds-dual-ring 1.2s linear infinite;
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