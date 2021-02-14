<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { slide } from 'svelte/transition'
    import type { TransitionDuration } from '../../models/TransitionDuration'
    import PanelComponent from '../widgets/PanelComponent.svelte'

    export let transitionDuration: TransitionDuration
    export let level: number | undefined = undefined

    const dispatch = createEventDispatcher()
    const levels = [1, 2, 3, 4, 5, 6, 0]

    function setDifficultyLevel(selectedLevel: number | undefined) {
        level = selectedLevel
        dispatch('setDifficultyLevel', { level })
    }
</script>

<div transition:slide|local="{transitionDuration}" class="mb-1 md:mb-2">
    <PanelComponent heading="Vanskelighetsgrad">
        <div
            class="text-lg flex flex-wrap border border-gray-500 rounded overflow-hidden divide-x divide-gray-500 mb-1 bg-white"
        >
            {#each levels as l}
                <label
                    class="flex-1 
                    py-2 text-center cursor-pointer transition-colors duration-200
                    {level ===
                    l
                        ? 'bg-blue-700  text-gray-100'
                        : ''}"
                >
                    {l === 0 ? '?' : l}
                    <input
                        class="sr-only"
                        type="radio"
                        name="difficulty"
                        value="{l}"
                        bind:group="{level}"
                        on:change="{() => setDifficultyLevel(l)}"
                    />
                </label>
            {/each}
        </div>
    </PanelComponent>
</div>
