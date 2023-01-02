<script lang="ts">
  import type { Author } from '@mpa/db';
  import userNoProfileImage from '$lib/assets/default-profile-img.png';
  import Picture from '../generic/Picture.svelte';
  export let author: Pick<Author.DB, 'img' | 'name'>;
</script>

<Picture
  className="author-image"
  on:click
  src={author.img}
  fallback={userNoProfileImage}
  alt={author.name}
  config={{ width: [70, 140] }}
/>

<style lang="postcss">
  :global(.author-image) {
    border-radius: 50%;
    width: 66px;
    height: 66px;
    background: #b0bec6;
    overflow: hidden;

    :global(img) {
      flex: 1;
      width: 100%;
    }
  }
</style>
