<script lang="ts">
    import * as animateScroll from 'svelte-scrollto'
    import MenuComponent from './components/MenuComponent.svelte'
    import ResultsComponent from './components/ResultsComponent.svelte'
    import QuizComponent from './components/QuizComponent.svelte'
    import GetReadyComponent from './components/GetReadyComponent.svelte'
    import GameOverComponent from './components/GameOverComponent.svelte'
    import type { Puzzle } from './models/Puzzle'
    import type { AppSettings } from './models/AppSettings'
    import { getQuiz } from './services/quizService'
    import { Operator } from './models/enums/Operator'
    import { GetEnumValues } from './services/enumService'
    import { PuzzleMode } from './models/enums/PuzzleMode'
    import { QuizState } from './models/enums/QuizState'

    const appSettings: AppSettings = {
        isLocalhost: location.hostname === 'localhost',
        countDownTime: 3,
        transitionDuration: {
            duration: 200,
        },
        operators: GetEnumValues(Operator),
        puzzleModes: GetEnumValues(PuzzleMode),
        displayGreeting: true,
    }

    let puzzleSet: Puzzle[]
    let quiz = getQuiz()

    let fakeInput: any

    function getReady(event) {
        quiz = event.detail.quiz
        quiz.state = QuizState.AboutToStart
        appSettings.displayGreeting = false
        animateScroll.scrollToTop()
        fakeInputFocus()
    }

    function startQuiz(event) {
        quiz.state = QuizState.Started
    }

    function abortQuiz() {
        quiz.state = QuizState.Initial
    }

    function completeQuiz(event) {
        quiz.state = QuizState.Completed
        puzzleSet = event.detail.puzzleSet
    }

    function evaluateQuiz() {
        quiz.state = QuizState.Evaluated
    }

    function resetQuiz() {
        quiz.state = QuizState.Initial
    }

    function fakeInputFocus() {
        // Hack to get Safari / Ios to focus
        // create invisible dummy input to receive the focus first
        // Ref: https://stackoverflow.com/a/45703019
        if (!fakeInput) {
            fakeInput = document.createElement('input')
            fakeInput.setAttribute('type', 'number')
            fakeInput.style.position = 'absolute'
            fakeInput.style.opacity = '0'
            fakeInput.style.height = '0'
            fakeInput.style.fontSize = '16px' // disable auto zoom

            // you may need to append to another element depending on the browser's auto
            // zoom/scroll behavior
            document.body.prepend(fakeInput)
        }

        fakeInput.focus()
    }
</script>

<main class="container max-w-xl mx-auto px-2 md:px-3 pt-1 pb-2 md:pb-5">
    <h1 class="text-2xl md:text-3xl font-light text-orange-600 mb-1 text-right">
        Regneflyt
        <small class="text-xs">1.1</small>
    </h1>
    {#if quiz.state === QuizState.AboutToStart}
        <GetReadyComponent
            {appSettings}
            on:startQuiz="{startQuiz}"
            on:completeQuiz="{completeQuiz}"
            on:abortQuiz="{abortQuiz}" />
    {:else if quiz.state === QuizState.Started}
        <QuizComponent
            {quiz}
            on:abortQuiz="{abortQuiz}"
            on:completeQuiz="{completeQuiz}"
            {appSettings} />
    {:else if quiz.state === QuizState.Completed}
        <GameOverComponent on:evaluateQuiz="{evaluateQuiz}" {appSettings} />
    {:else if quiz.state === QuizState.Evaluated}
        <ResultsComponent {puzzleSet} on:resetQuiz="{resetQuiz}" />
    {:else}
        <MenuComponent {quiz} on:getReady="{getReady}" {appSettings} />
    {/if}
</main>
