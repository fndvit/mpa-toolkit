<script lang="ts">
  import type { PageData } from './$types';
  import Spinner from '$lib/components/generic/Spinner.svelte';
  import { toaster, SortableList } from '$lib/components';
  import * as api from '$lib/api';

  export let data: PageData;

  let { components } = data;

  let list = components.map((component, index) => ({
    id: index,
    value: component
  }));

  let saving = false;

  const sortList = ev => (list = ev.detail);

  const saveList = async () => {
    saving = true;

    components = list.map(item => item.value);

    try {
      await api.homepage.updateComponents(components);
      toaster.done('Page ordering updated');
    } catch (e) {
      toaster.error('Error saving page ordering');
    }

    saving = false;
  };
  const componentsIconLookup = {
    chapters: 'view_carousel',
    casestudies: 'view_carousel',
    lifecycle: 'incomplete_circle',
    search: 'search',
    madlib: 'arrow_drop_down_circle'
  };
</script>

<div class="cms-pageordering">
  <h3>LANDING PAGE</h3>

  <div class="grid-links">
    <SortableList {list} key="id" let:item on:sort={sortList}>
      <div class="item">
        <span class="material-icons">{componentsIconLookup[item.value]}</span>
        {item.value}
      </div>
    </SortableList>
  </div>
  <button on:click={saveList} disabled={saving}>
    <div style={saving ? 'display: none;' : ''}>Save</div>
    <div class="spinner p-responsive" class:saving>
      Saving...<Spinner />
    </div>
  </button>
</div>

<style lang="stylus">

  .material-icons {
    font-size: 60px;
  }

 .cms-pageordering {


  margin-top: 40px;

  text-align: center;

    button{
      height: 50px;
      width: 150px;
      text-align: center;
      typography: ui-large;
    }

    h3 {
      typography: h3-light-responsive;
      margin-bottom: 40px;
      text-align: center;
    }

  }

  .grid-links {
    display: flex;
    column-gap: 24px;
    row-gap: 24px;
    justify-content: center;

    .item {
      typography: ui;
      color: black;
      cursor: pointer;
      text-transform: uppercase;
      display: flex;
      // flex-direction: column;
      text-decoration: none;
      align-items: center;
      // justify-content: space-between;
      column-gap: 40px;
      background: white;
      border-radius: 24px;
      box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);
      padding: 20px 40px;
      width: 300px;
      box-sizing: border-box;

      &:hover {
        background: $colors.neutral-bg;
        text-decoration: none;
      }
    }
  }

  .spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 15px;
    &:not(.saving) {
      visibility: hidden;
      display: none;
    }
  }

</style>
