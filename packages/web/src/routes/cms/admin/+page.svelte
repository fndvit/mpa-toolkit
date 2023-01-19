<script lang="ts">
  import { ky } from '$lib/api';
  import LoadingButton from '$lib/components/generic/LoadingButton.svelte';
  import { toaster } from '$lib/components/generic';

  let rebuilding = false;
  async function onClickRebuildSearchIndex() {
    rebuilding = true;
    try {
      const response = await ky.post('search/rebuild');
      if (response.status === 200) {
        rebuilding = false;
        const { count } = await response.json<{ count: number }>();
        toaster.done(`Search index rebuilt for ${count} pages`);
      } else {
        toaster.error('Failed to rebuild search index');
        console.error(await response.json());
      }
    } catch (err) {
      toaster.error('Failed to rebuild search index');
      console.error(err);
    } finally {
      rebuilding = false;
    }
  }
</script>

<div class="container">
  <div class="title">
    <a href="/cms">
      <span class="material-icons">navigate_before</span>
    </a>
    <h2>Admin</h2>
  </div>

  <div class="controls">
    <LoadingButton on:click={onClickRebuildSearchIndex} loading={rebuilding}>Rebuild search index</LoadingButton>
  </div>
</div>

<style lang="postcss">
  .container {
    box-sizing: border-box;
    padding: 20px;
    margin: 0 auto;
    width: fit-content;
    font: $f-ui;

    > .title {
      display: flex;
      align-items: center;
      column-gap: 20px;
      margin-bottom: 20px;
    }

    h2 {
      @mixin font-responsive h2;

      margin: 10px 0;
    }
  }

  .controls {
    display: flex;
    column-gap: 10px;
  }
</style>
