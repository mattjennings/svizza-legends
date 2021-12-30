import { readable } from 'svelte/store'

const map = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right'
}

/**
 * A store that contains information on the current user input
 */
export const input = readable({ direction: null }, (set) => {
  const heldDirections = []
  window.addEventListener('keydown', (ev) => {
    const dir = map[ev.code]

    if (dir && !heldDirections.includes(dir)) {
      heldDirections.unshift(dir)
      set({
        direction: heldDirections[0]
      })
    }
  })

  window.addEventListener('keyup', (ev) => {
    const dir = map[ev.code]
    const index = heldDirections.indexOf(dir)
    if (index > -1) {
      heldDirections.splice(index, 1)
      set({
        direction: heldDirections[0]
      })
    }
  })
})
