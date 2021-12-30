<!-- <svelte:options immutable={true} /> -->
<script lang="ts">
  import { getCanvas } from '$lib/components/Canvas.svelte'
  import { onGameLoop } from '$lib/utils/game-loop'

  export let src: string
  export let x = 0
  export let y = 0
  export let offset: { x?: number; y?: number } = {}
  export let width = undefined
  export let height = undefined

  export let animation = undefined
  export let animations: Record<string, Array<[number, number]>> = undefined
  export let frameRate = 8

  const canvas = getCanvas()
  const image = new Image()

  let isLoaded = false
  let currentAnimationProgress = 0

  $: ctx = $canvas.getContext('2d')

  $: currentAnimation = animations?.[animation]
  $: currentAnimationLength = currentAnimation?.length * frameRate
  $: frame =
    currentAnimation?.[Math.floor(currentAnimationProgress / frameRate)]

  // reset  progress if animation changes
  $: currentAnimation, (currentAnimationProgress = 0)

  // load image
  $: (image.src = src), (isLoaded = false)
  image.onload = () => {
    isLoaded = true
  }

  onGameLoop(() => {
    if (!isLoaded) return

    let translatedX = Math.floor(x) + (offset.x ?? 0)
    let translatedY = Math.floor(y) + (offset.y ?? 0)

    // draw image
    if (width || height) {
      ctx.drawImage(
        image,
        frame?.[0] * width,
        frame?.[1] * height,
        width,
        height,
        translatedX,
        translatedY,
        width,
        height
      )
    } else {
      ctx.drawImage(image, translatedX, translatedY)
    }

    if (animations) {
      currentAnimationProgress += 1

      if (currentAnimationProgress >= currentAnimationLength) {
        currentAnimationProgress = 0
      }
    }
  }, 'post')
</script>
