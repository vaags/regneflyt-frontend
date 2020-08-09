<script lang="ts">
    import { onMount } from 'svelte'
    import * as animateScroll from 'svelte-scrollto'
    import MenuComponent from './components/MenuComponent.svelte'
    import ResultsComponent from './components/ResultsComponent.svelte'
    import QuizComponent from './components/QuizComponent.svelte'
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

    function startQuiz(event) {
        quiz = event.detail.quiz
        quiz.isAboutToStart = true
        appSettings.displayGreeting = false
        animateScroll.scrollToTop()
        fakeInputFocus()
    }

    function abortQuiz() {
        quiz.isStarted = false
        quiz.isAboutToStart = false
    }

    function completeQuiz(event) {
        quiz.isCompleted = true
        puzzleSet = event.detail.puzzleSet
    }

    function resetQuiz() {
        quiz.isCompleted = false
        quiz.isStarted = false
    }

    function fakeInputFocus() {
        // Hack to get Safari / Ios to focus
        // create invisible dummy input to receive the focus first
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

    onMount(() => {
        if (!appSettings.isLocalhost) {
            window.addEventListener('beforeunload', function (e) {
                var confirmationMessage = 'o/'

                ;(e || window.event).returnValue = confirmationMessage //Gecko + IE
                return confirmationMessage //Webkit, Safari, Chrome
            })
        }
    })
</script>

<main class="container max-w-xl mx-auto px-2 md:px-3 pt-1 pb-2 md:pb-5">
    <h1 class="text-3xl md:text-4xl font-light text-orange-600 mb-1 text-right">
        Regneflyt
    </h1>
    {#if quiz.isCompleted}
        <ResultsComponent {puzzleSet} on:resetQuiz="{resetQuiz}" />
    {:else if quiz.isAboutToStart || quiz.isStarted}
        <QuizComponent
            {quiz}
            on:abortQuiz="{abortQuiz}"
            on:completeQuiz="{completeQuiz}"
            {appSettings} />
    {:else}
        <MenuComponent {quiz} on:startQuiz="{startQuiz}" {appSettings} />
    {/if}
</main>
