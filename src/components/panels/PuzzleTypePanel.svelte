<script lang="ts">
    import { PuzzleMode } from '../../models/constants/PuzzleMode'
    import PanelComponent from '../widgets/PanelComponent.svelte'

    export let quizPuzzleMode: PuzzleMode
</script>

<PanelComponent heading="Oppgaveform">
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
</PanelComponent>
