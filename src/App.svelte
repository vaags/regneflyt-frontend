<script lang="ts">
    import * as animateScroll from 'svelte-scrollto'
    import MenuComponent from './components/MenuComponent.svelte'
    import ResultsComponent from './components/ResultsComponent.svelte'
    import QuizComponent from './components/QuizComponent.svelte'
    import GetReadyComponent from './components/GetReadyComponent.svelte'
    import type { Puzzle } from './models/Puzzle'
    import type { AppSettings } from './models/AppSettings'
    import { getQuiz } from './services/quizService'
    import { Operator } from './models/enums/Operator'
    import { GetEnumValues } from './services/enumService'
    import { PuzzleMode } from './models/enums/PuzzleMode'

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
    let eventListener: any

    function getReady(event) {
        quiz = event.detail.quiz
        quiz.isAboutToStart = true
        appSettings.displayGreeting = false
        animateScroll.scrollToTop()
        fakeInputFocus()
    }

    function startQuiz(event) {
        quiz.isStarted = true
        quiz.isAboutToStart = false
    }

    function abortQuiz() {
        quiz.isStarted = false
        quiz.isAboutToStart = false
    }

    function completeQuiz(event) {
        quiz.isCompleted = true
        quiz.isStarted = false
        quiz.isAboutToStart = false
        puzzleSet = event.detail.puzzleSet
    }

    function resetQuiz() {
        quiz.isCompleted = false
        quiz.isStarted = false
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

        // focus so that subsequent async focus will work
        fakeInput.focus()
    }
</script>

<main class="container max-w-xl mx-auto px-2 md:px-3 pt-1 pb-2 md:pb-5">
    <h1 class="text-2xl md:text-3xl font-light text-orange-600 mb-1 text-right">
        Regneflyt
        <small class="text-xs">1.1</small>
    </h1>
    {#if quiz.isAboutToStart}
        <GetReadyComponent {appSettings} on:startQuiz="{startQuiz}" />
    {:else if quiz.isStarted}
        <QuizComponent
            {quiz}
            on:abortQuiz="{abortQuiz}"
            on:completeQuiz="{completeQuiz}"
            {appSettings} />
    {:else if quiz.isCompleted}
        <ResultsComponent {puzzleSet} on:resetQuiz="{resetQuiz}" />
    {:else}
        <MenuComponent {quiz} on:getReady="{getReady}" {appSettings} />
    {/if}
</main>
