<script context="module" lang="ts">
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'

  export function getCanvas() {
    return getContext<Writable<HTMLCanvasElement>>('canvas')
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { onGameLoop } from '$lib/utils/game-loop'

  let canvas = writable(null)
  $: ctx = $canvas?.getContext('2d')

  onGameLoop(() => {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height)
  })

  setContext('canvas', canvas)
</script>

<canvas bind:this={$canvas}>
  <!-- only render children once $canvas is populated -->
  {#if $canvas}
    <slot />
  {/if}
</canvas>

<style>
  canvas {
    image-rendering: pixelated;
  }
</style>
