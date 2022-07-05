<script lang="ts">
  import { session } from "$app/stores";
  import InlineSvg from "$lib/components/generic/InlineSvg.svelte";

  var cmsLinks = [{
    icon: 'FileIcon',
    path: "pages",
    title: "PAGES"
  }, {
    icon: 'TagIcon',
    path: "tags",
    title: "TAGS"
  },{
    icon: 'UserIcon',
    path: "users",
    title: "USERS"
  }];

</script>

<div class="cms-homepage">

  {#if $session.user === undefined}
  
    <h2>WELCOME</h2>  
  
    <div class="signIn-button">
      <a href="/api/auth/signin/google">
        Sign in with Google
      </a>
    </div>
  
  {:else}

    <h3>WELCOME {$session.user.name}</h3>

    <div class="grid-links">

      {#each cmsLinks as link}
        {#if link.path == "users" && $session.user.role == "ADMIN" || link.path != "users"}
          <a href="/cms/{link.path}">
            <div class="cms-links">
              <div class="icon">
                <InlineSvg svg={link.icon}/>
              </div>
              <p>{ link.title }</p>
            </div></a>
          {/if}
      {/each}

    </div>
      
    <div style="margin-top: 40px">
      <a href="/api/auth/signout">Signout</a>
    </div>
  {/if}
</div>

<style lang="stylus">

 .cms-homepage {

    position: fixed; 
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    h2 {
      typography: h2-responsive;
      margin-bottom: 30px;
      text-align: center;
    }

    h3 {
      typography: h3-light-responsive;
      margin-bottom: 40px;
      text-align: center;
    }

    a {
      typography: ui-small;
      color: black;
      text-decoration: none;
    }
  }

  .signIn-button {

    padding: 1.5rem;
    width: 275px;
    background: $colors.neutral-light;
    border-radius: 24px;

  }  

  .grid-links {

    display: grid;
    grid-template-columns: auto auto auto;
    grid-gap: 24px;

  }

  .cms-links {

    background: white;
    border-radius: 24px;
    box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1); 
    width: 185px;
    height: 140px;

    &:hover{
      background: $colors.neutral-light;
    }

    .icon {
      padding-top: 20px;
    }
  }

</style>
