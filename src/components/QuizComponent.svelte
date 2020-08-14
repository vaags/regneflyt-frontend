<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import PuzzleComponent from './PuzzleComponent.svelte'
    import type { Quiz } from '../models/Quiz'
    import type { Puzzle } from '../models/Puzzle'
    import type { AppSettings } from '../models/AppSettings'
    import CancelComponent from './CancelComponent.svelte'

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
</script>

<PuzzleComponent
    seconds="{quiz.duration * 60}"
    {showWarning}
    {quiz}
    on:quizTimeout="{completeQuiz}"
    on:addPuzzle="{addPuzzle}" />

<CancelComponent
    isLocalhost="{appSettings.isLocalhost}"
    on:abortQuiz="{abortQuiz}"
    on:completeQuiz="{completeQuiz}" />
