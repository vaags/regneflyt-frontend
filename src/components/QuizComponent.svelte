<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import PuzzleComponent from './PuzzleComponent.svelte'
    import type { Quiz } from '../models/Quiz'
    import type { Puzzle } from '../models/Puzzle'
    import type { AppSettings } from '../models/AppSettings'
    import CancelComponent from './CancelComponent.svelte'

    export let quiz: Quiz
    export let appSettings: AppSettings

    const dispatch = createEventDispatcher()
    let showComponent: boolean
    let showWarning = false
    let puzzleSet: Puzzle[] = []

    function abortQuiz() {
        dispatch('abortQuiz')
    }

    function completeQuiz() {
        dispatch('completeQuiz', { puzzleSet })
    }

    function addPuzzle(event: any) {
        puzzleSet = [...puzzleSet, event.detail.puzzle]
    }

    onMount(() => {
        setTimeout(() => {
            showComponent = true
        }, appSettings.pageTransitionDuration.duration)
    })
</script>

{#if showComponent}
    <div transition:fade="{appSettings.pageTransitionDuration}">
        <PuzzleComponent
            seconds="{quiz.duration * 60}"
            showWarning="{showWarning}"
            quiz="{quiz}"
            operatorSigns="{appSettings.operatorSigns}"
            on:quizTimeout="{completeQuiz}"
            on:addPuzzle="{addPuzzle}" />

        <CancelComponent
            showCancelButton="{!appSettings.isProduction}"
            on:abortQuiz="{abortQuiz}"
            on:completeQuiz="{completeQuiz}" />
    </div>
{/if}
