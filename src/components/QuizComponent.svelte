<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import PuzzleComponent from './PuzzleComponent.svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import type { Quiz } from '../models/Quiz'
    import type { Puzzle } from '../models/Puzzle'
    import TimeoutComponent from './widgets/TimeoutComponent.svelte'
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

    function startQuiz() {
        quiz.isStarted = true
        quiz.isAboutToStart = false
    }
</script>

<div>
    {#if quiz.isStarted}
        <PuzzleComponent
            seconds="{quiz.duration * 60}"
            {showWarning}
            {appSettings}
            {quiz}
            on:quizTimeout="{completeQuiz}"
            on:addPuzzle="{addPuzzle}" />
    {:else if quiz.isAboutToStart}
        <div class="card">
            <h2>Gjør deg klar&hellip;</h2>

            <p class="text-center my-12 text-4xl md:text-5xl">
                <TimeoutComponent
                    seconds="{appSettings.countDownTime}"
                    fadeOnSecondChange="{true}"
                    on:finished="{startQuiz}" />
            </p>
        </div>
    {/if}
    <div class="text-right float-right">
        {#if showWarning}
            <p class="mb-2 text-gray-100">Ønsker du å avbryte?</p>
            <span class="mr-1">
                <ButtonComponent
                    on:click="{abortQuiz}"
                    label="ja"
                    color="red" />
            </span>
            <ButtonComponent on:click="{toggleWarning}" label="Nei" />
        {:else}
            {#if appSettings.isLocalhost}
                <span class="mr-2">
                    <ButtonComponent
                        on:click="{completeQuiz}"
                        label="Fullfør" />
                </span>
            {/if}
            <ButtonComponent on:click="{toggleWarning}" label="Avbryt" />
        {/if}
    </div>

</div>
