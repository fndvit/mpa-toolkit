<script lang="ts">
  import type { User } from "$lib/types";
  import { staticUrl } from "$lib/helpers/content";
  import userNoProfileImage from '$lib/assets/default-profile-img.png';

  export let user: Pick<User, 'img' | 'name'>;

  $: src = user.img ? staticUrl(user.img) : userNoProfileImage;

</script>

<img class="user-image" on:click {src} alt={user.name} />

<style lang="scss">
  img {
    border-radius: 50%;
    width: 66px;
    height: 66px;
  }
</style>
