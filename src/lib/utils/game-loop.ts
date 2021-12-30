import { browser } from '$app/env'
import { onMount } from 'svelte'

const loops: Record<LoopPriority, Array<(time: number) => void>> = {
  pre: [],
  step: [],
  post: []
}

type LoopPriority = 'pre' | 'step' | 'post'

/**
 * Creates a game loop for the Svelte component
 */
export function onGameLoop(
  fn: (delta: number) => void,
  priority?: LoopPriority
) {
  onMount(() => loop(fn, priority))
}

/**
 * Adds the function to the game loop.
 *
 * Returns a function that unsubscribes.
 */
export function loop(
  fn: (delta: number) => void,

  /**
   * The priority of the loop. Order of loops are pre -> step -> post
   */
  priority: LoopPriority = 'step'
) {
  loops[priority].push(fn)

  return () => {
    const index = loops[priority].indexOf(fn)
    loops[priority].splice(index, 1)
  }
}

/**
 * Takes a generator function that is invoked on every game loop until
 * it is finished.
 *
 * @example
 * // this will increase the value of `x` by 1 every frame for 10 frames
 * coroutine(function* () {
 *  let frame = 0
 *
 *  while (frame < 10) {
 *   x += 1
 *   yield
 *  }
 * })
 */
export function coroutine<T, R>(
  fn: () => Generator<T, R, number>,
  priority?: LoopPriority
) {
  const generator = fn()

  const unsub = loop((time) => {
    const result = generator.next(time)
    if (result.done) {
      unsub()
    }
  }, priority)

  return generator
}

// start the game loop
function gameLoop(time = 0) {
  function iterate(priority: LoopPriority) {
    for (let i = 0; i < loops[priority].length; i++) {
      loops[priority][i](time)
    }
  }

  iterate('pre')
  iterate('step')
  iterate('post')

  const now = performance.now()
  requestAnimationFrame((time) => gameLoop(time - now))
}

// start the game loop
if (browser) {
  gameLoop()
}
