<script>
  import { withGrid } from '$lib/utils'

  import { onGameLoop } from '$lib/utils/game-loop'
  import { input } from '$lib/utils/input'
  import { onMount } from 'svelte'

  import Person from './Person.svelte'

  let person

  onGameLoop(() => {
    if ($input.direction) {
      person.move({
        direction: $input.direction,
        speed: 0.75
      })
    }
  })
</script>

<Person
  bind:this={person}
  src="images/characters/people/hero.png"
  x={withGrid(5)}
  y={withGrid(5)}
/>
