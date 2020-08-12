<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import PuzzleComponent from './PuzzleComponent.svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import type { Quiz } from '../models/Quiz'
    import type { Puzzle } from '../models/Puzzle'
    import type { AppSettings } from '../models/AppSettings'

    export let quiz: Quiz
    export let appSettings: AppSettings

    const dispatch = createEventDispatcher()
    let showWarning = false
    let puzzleSet: Puzzle[] = []

    function abortQuiz() {
        dispatch('abortQuiz')
    }

    function completeQuiz() {
        dispatch('completeQuiz', { puzzleSet })
    }

    function addPuzzle(event) {
        puzzleSet = [...puzzleSet, event.detail.puzzle]
    }

    function toggleWarning() {
        showWarning = !showWarning
    }
</script>

<PuzzleComponent
    seconds="{quiz.duration * 60}"
    {showWarning}
    {quiz}
    on:quizTimeout="{completeQuiz}"
    on:addPuzzle="{addPuzzle}" />
<div class="text-right float-right">
    {#if showWarning}
        <p class="mb-2 text-gray-100">Ønsker du å avbryte?</p>
        <span class="mr-1">
            <ButtonComponent on:click="{abortQuiz}" label="ja" color="red" />
        </span>
        <ButtonComponent on:click="{toggleWarning}" label="Nei" />
    {:else}
        {#if appSettings.isLocalhost}
            <span class="mr-2">
                <ButtonComponent on:click="{completeQuiz}" label="Fullfør" />
            </span>
        {/if}
        <ButtonComponent on:click="{toggleWarning}" label="Avbryt" />
    {/if}
</div>
