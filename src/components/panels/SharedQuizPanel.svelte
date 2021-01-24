<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { slide } from 'svelte/transition'
    import CardComponent from '../widgets/CardComponent.svelte'
    import type { TransitionDuration } from '../../models/TransitionDuration'
    import type { Puzzle } from '../../models/Puzzle'
    import PuzzlePreviewComponent from '../widgets/PuzzlePreviewComponent.svelte'

    export let title: string | undefined
    export let transitionDuration: TransitionDuration
    export let puzzle: Puzzle | undefined

    const dispatch = createEventDispatcher()
</script>

<div transition:slide|local="{transitionDuration}">
    <CardComponent heading="{title}" label="Forhåndsvisning">
        <div
            class="text-3xl md:text-4xl text-center mb-1 mt-4"
            transition:slide|local="{transitionDuration}"
        >
            <PuzzlePreviewComponent puzzle="{puzzle}" />
            <button
                type="button"
                class="cursor-pointer focus:outline-none ml-3 float-right"
                title="Nytt oppgave-eksempel"
                on:click="{() => dispatch('getPuzzlePreview')}"
            >
                🎲
            </button>
        </div>
    </CardComponent>
</div>
