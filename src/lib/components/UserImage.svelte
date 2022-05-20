<script lang="ts">
  import type { User } from "$lib/types";
  import { staticUrl } from "$lib/helpers/content";

  export let user: Pick<User, 'img' | 'name'>;

  $: src = user.img ? staticUrl(user.img) : '/static/missing-profile-photo.png';

</script>

<img class="user-image" on:click {src} alt={user.name} />

<style>
  img {
    border-radius: 50%;
    width: 66px;
    height: 66px;
  }
</style>
