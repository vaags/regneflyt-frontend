<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { slide } from 'svelte/transition'
    import type { TransitionDuration } from '../../models/TransitionDuration'
    import CardComponent from '../widgets/CardComponent.svelte'

    export let transitionDuration: TransitionDuration
    export let level: number | string | undefined = 1

    const dispatch = createEventDispatcher()
    const levels = [1, 2, 3, 4, 5, 6, '?']

    function setDifficultyLevel(selectedLevel: number | string) {
        level = selectedLevel
        dispatch('setDifficultyLevel', { level })
    }
</script>

<div transition:slide|local="{transitionDuration}" class="mb-1 md:mb-2">
    <CardComponent heading="Vanskelighetsgrad">
        <div class="text-lg flex flex-wrap">
            {#each levels as l}
                <span
                    on:click="{() => setDifficultyLevel(l)}"
                    class="px-4 mr-2 mt-2 py-2 cursor-pointer border rounded transition-colors duration-200 {level ===
                    l
                        ? 'bg-blue-700 border-blue-900 text-gray-100'
                        : 'bg-white border-gray-500'}"
                >
                    {l}
                </span>
            {/each}
        </div>
    </CardComponent>
</div>
