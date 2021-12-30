<script lang="ts">
  import { coroutine, onGameLoop, withGrid } from '$lib/utils'
  import Sprite from './Sprite.svelte'

  export let src
  export let x = 0
  export let y = 0
  export let facing = 'down'

  let animation = 'walk-down'
  let isMoving = false

  interface MoveArgs {
    direction: 'up' | 'down' | 'left' | 'right'
    distance?: number
    speed?: number
  }

  /**
   * Moves the character along the grid. Can take an array of sequenced steps.
   */
  export function move(args: MoveArgs | MoveArgs[]) {
    const steps = Array.isArray(args) ? [...args] : [args]
    if (isMoving) return
    isMoving = true

    return coroutine(
      function* () {
        let step = steps.shift()

        while (step) {
          const { direction, distance = 1, speed = 1 } = step
          let frame = 0
          let frames = withGrid(distance) / speed

          facing = direction

          while (frame < frames) {
            if (direction === 'up') {
              y -= speed
            } else if (direction === 'down') {
              y += speed
            } else if (direction === 'left') {
              x -= speed
            } else if (direction === 'right') {
              x += speed
            }

            frame += 1
            yield
          }

          step = steps.shift()
        }

        isMoving = false
      },
      // run during 'pre' so that isMoving is current for 'step' and 'post'
      'pre'
    )
  }

  onGameLoop(() => {
    if (isMoving) {
      animation = `walk-${facing}`
    } else {
      animation = `idle-${facing}`
    }
  }, 'post')
</script>

<!-- shadow -->
<Sprite
  src="/images/characters/shadow.png"
  {x}
  {y}
  width={32}
  height={32}
  offset={{
    x: -8,
    y: -18
  }}
/>
<!-- person -->
<Sprite
  {src}
  {x}
  {y}
  width={32}
  height={32}
  offset={{
    x: -8,
    y: -18
  }}
  {animation}
  animations={{
    'idle-down': [[0, 0]],
    'idle-right': [[0, 1]],
    'idle-up': [[0, 2]],
    'idle-left': [[0, 3]],
    'walk-down': [
      [1, 0],
      [0, 0],
      [3, 0],
      [0, 0]
    ],
    'walk-right': [
      [1, 1],
      [0, 1],
      [3, 1],
      [0, 1]
    ],
    'walk-up': [
      [1, 2],
      [0, 2],
      [3, 2],
      [0, 2]
    ],
    'walk-left': [
      [1, 3],
      [0, 3],
      [3, 3],
      [0, 3]
    ]
  }}
/>
