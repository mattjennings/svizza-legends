<script>
  import Canvas from '$lib/components/Canvas.svelte'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount, beforeUpdate } from 'svelte'

  onMount(() => {
    // force user to hit index page
    if ($page.path !== '/') {
      goto('/')
    }
  })

  // we use kit's file-based routing for our levels, but we don't
  // want the routes to show in the address bar
  beforeUpdate(() => {
    window.history.replaceState(null, null, '/')
  })
</script>

<div class="container">
  <Canvas>
    <slot />
  </Canvas>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    background: #333;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  .container {
    position: relative;
    width: 352px;
    height: 198px;
    outline: 1px solid #fff;
    margin: 0 auto;

    transform: scale(2) translateY(50%);
  }
</style>
