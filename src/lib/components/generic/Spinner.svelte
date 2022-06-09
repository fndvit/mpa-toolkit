<div class="spinner"></div>

<style lang="stylus">
.spinner {
  --spinner-color: #333;
  --spinner-size: 26px;
  --spinner-thickness: 3px;
  display: inline-block;
  position: relative;
  width: var(--spinner-size);
  height: var(--spinner-size);
}
.spinner:after {
  --inner-size: calc(var(--spinner-size) * (3/4));
  content: " ";
  display: block;
  width: var(--inner-size);
  height: var(--inner-size);
  border-radius: 50%;
  border: var(--spinner-thickness) solid var(--spinner-color);
  border-color: var(--spinner-color) transparent var(--spinner-color) transparent;
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