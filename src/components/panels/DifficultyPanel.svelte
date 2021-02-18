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
            {#each levels as l, i}
                <input
                    id="l-{l}"
                    class="sr-only"
                    type="radio"
                    name="difficulty"
                    value="{l}"
                    bind:group="{level}"
                    on:change="{() => setDifficultyLevel(l)}"
                />
                <label
                    for="l-{l}"
                    style="{i == 0 ? 'border: 0' : ''}"
                    class="flex-1 
                    py-2 text-center cursor-pointer transition-all duration-200
                    {level ===
                        l && 'bg-blue-700 text-gray-100'}"
                >
                    {l === 0 ? '?' : l}
                </label>
            {/each}
        </div>
    </PanelComponent>
</div>

<style>
    input[type='radio']:focus + label {
        @apply ring-2;
        @apply ring-blue-300;
        @apply ring-inset;
    }
</style>
