<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { slide } from 'svelte/transition'
    import PanelComponent from '../widgets/PanelComponent.svelte'
    import type { TransitionDuration } from '../../models/TransitionDuration'
    import type { Puzzle } from '../../models/Puzzle'
    import PuzzlePreviewComponent from '../widgets/PuzzlePreviewComponent.svelte'
    import AlertComponent from '../widgets/AlertComponent.svelte'
    import LabelComponent from '../widgets/LabelComponent.svelte'

    export let title: string | undefined
    export let transitionDuration: TransitionDuration
    export let puzzle: Puzzle
    export let validationError: boolean

    const dispatch = createEventDispatcher()
</script>

<div transition:slide|local="{transitionDuration}">
    <div class="float-right mt-5 mr-5">
        <LabelComponent>Eksempeloppgave</LabelComponent>
    </div>
    <PanelComponent heading="{title}">
        {#if validationError}
            <div class="mt-4" transition:slide|local="{transitionDuration}">
                <AlertComponent color="yellow">
                    Kan ikke vise forhåndsvisning.
                </AlertComponent>
            </div>
        {:else}
            <div class="text-3xl md:text-4xl text-center mb-1">
                <PuzzlePreviewComponent puzzle="{puzzle}" />
                <button
                    type="button"
                    class="cursor-pointer float-right"
                    title="Nytt oppgave-eksempel"
                    on:click="{() => dispatch('getPuzzlePreview')}"
                >
                    🎲
                </button>
            </div>
        {/if}
    </PanelComponent>
</div>
