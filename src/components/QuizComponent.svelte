<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import PuzzleComponent from './PuzzleComponent.svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import type { Quiz } from '../models/Quiz'
    import type { Puzzle } from '../models/Puzzle'
    import CountdownComponent from './CountdownComponent.svelte'

    export let quiz: Quiz

    const dispatch = createEventDispatcher()
    let quizTimeout: number
    let timeLeftInterval: number
    let secondsLeft = quiz.duration * 60
    let showWarning = false
    let puzzleSet: Array<Puzzle> = []
    const isLocalhost = location.hostname === 'localhost'

    onDestroy(() => {
        clearTimeout(quizTimeout)
        clearInterval(timeLeftInterval)
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

    function startQuiz() {
        quiz.isStarted = true
        quiz.isAboutToStart = false
        quizTimeout = setTimeout(completeQuiz, quiz.duration * 60000)
        timeLeftInterval = setInterval(() => {
            if (secondsLeft > 1) secondsLeft--
        }, 1000)
    }

    onMount(() => {
        quizTimeout = setTimeout(startQuiz, quiz.countDownTime * 1000)
    })
</script>

<div>
    {#if quiz.isStarted}
        <PuzzleComponent
            {secondsLeft}
            {showWarning}
            {quiz}
            on:addPuzzle="{addPuzzle}" />
        <div class="text-right float-right">
            {#if showWarning}
                <p class="mb-2 text-gray-100">Ønsker du å avbryte?</p>
                <ButtonComponent
                    on:click="{abortQuiz}"
                    label="ja"
                    color="red" />
                <ButtonComponent on:click="{toggleWarning}" label="Nei" />
            {:else}
                {#if isLocalhost}
                    <ButtonComponent
                        on:click="{completeQuiz}"
                        label="Fullfør" />
                {/if}
                <ButtonComponent on:click="{toggleWarning}" label="Avbryt" />
            {/if}
        </div>
    {:else if quiz.isAboutToStart}
        <CountdownComponent time="{quiz.countDownTime}" />
    {/if}

</div>
