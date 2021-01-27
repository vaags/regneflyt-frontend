<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { slide } from 'svelte/transition'
    import type { TransitionDuration } from '../../models/TransitionDuration'
    import CardComponent from '../widgets/CardComponent.svelte'

    export let transitionDuration: TransitionDuration
    export let level: number | string | undefined = undefined

    const dispatch = createEventDispatcher()
    const levels = [1, 2, 3, 4, 5, 6, 7, 'x']

    function setDifficultyLevel(selectedLevel: number | string | undefined) {
        level = selectedLevel
        dispatch('setDifficultyLevel', { level })
    }
</script>

<div transition:slide|local="{transitionDuration}" class="mb-1 md:mb-2">
    <CardComponent heading="Vanskelighetsgrad">
        <div class="text-lg flex flex-wrap border border-gray-500">
            {#each levels as l}
                <label
                    class="flex-1 
                    py-2 text-center cursor-pointer transition-colors duration-200
                    {level ===
                    l
                        ? 'bg-blue-700 text-gray-100'
                        : ''}"
                >
                    {l === 'x' ? '?' : l}
                    <input
                        class="sr-only"
                        type="radio"
                        name="difficulty"
                        value="{l}"
                        bind:group="{level}"
                        on:click="{() => setDifficultyLevel(l)}"
                    />
                </label>
            {/each}
        </div>
    </CardComponent>
</div>
