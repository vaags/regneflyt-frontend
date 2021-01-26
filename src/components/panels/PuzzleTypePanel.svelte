<script lang="ts">
    import { slide } from 'svelte/transition'
    import { PuzzleMode } from '../../models/constants/PuzzleMode'
    import type { TransitionDuration } from '../../models/TransitionDuration'
    import AlertComponent from '../widgets/AlertComponent.svelte'
    import CardComponent from '../widgets/CardComponent.svelte'

    export let quizPuzzleMode: PuzzleMode
    export let validationError: boolean
    export let transitionDuration: TransitionDuration
</script>

<CardComponent heading="Oppgaveform">
    <div class="flex flex-row justify-between items-end">
        <div>
            {#each Object.values(PuzzleMode) as puzzleMode}
                <label class="flex items-center py-1 text-lg">
                    <input
                        type="radio"
                        class="h-5 w-5 mr-2 text-blue-700"
                        bind:group="{quizPuzzleMode}"
                        value="{puzzleMode}"
                    />
                    <span>
                        {#if puzzleMode === PuzzleMode.Normal}
                            Normal
                        {:else if puzzleMode === PuzzleMode.Alternate}
                            Omvendt
                        {:else}Tilfeldig{/if}
                    </span>
                </label>
            {/each}
        </div>
        <div>
            {#if validationError}
                <div transition:slide|local="{transitionDuration}">
                    <AlertComponent color="yellow">
                        Kan ikke vise forhåndsvisning.
                    </AlertComponent>
                </div>
            {/if}
        </div>
    </div>
</CardComponent>
