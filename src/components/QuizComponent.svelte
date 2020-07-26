<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import PuzzleComponent from './PuzzleComponent.svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import type { Quiz } from '../models/Quiz'
    import type { Puzzle } from '../models/Puzzle'

    export let quiz: Quiz

    const dispatch = createEventDispatcher()
    const interval = setTimeout(completeQuiz, quiz.duration * 60000)
    let showWarning = false
    let puzzleSet: Array<Puzzle> = []
    const isLocalhost = location.hostname === 'localhost'

    onDestroy(() => {
        clearInterval(interval)
    })

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

<div>
    <PuzzleComponent {showWarning} {quiz} on:addPuzzle="{addPuzzle}" />

    <div class="text-right float-right">
        {#if showWarning}
            <p class="mb-2 text-gray-100">Ønsker du å avbryte?</p>
            <ButtonComponent on:click="{abortQuiz}" label="ja" color="red" />
            <ButtonComponent on:click="{toggleWarning}" label="Nei" />
        {:else}
            {#if isLocalhost}
                <ButtonComponent on:click="{completeQuiz}" label="Fullfør" />
            {/if}
            <ButtonComponent
                on:click="{toggleWarning}"
                label="Avbryt"
                color="gray" />
        {/if}
    </div>
</div>
