<script lang="ts">
    import Tailwindcss from './Tailwind.svelte'
    import { onMount } from 'svelte'
    import * as animateScroll from 'svelte-scrollto'
    import MenuComponent from './components/MenuComponent.svelte'
    import ResultsComponent from './components/ResultsComponent.svelte'
    import QuizComponent from './components/QuizComponent.svelte'
    import GetReadyComponent from './components/GetReadyComponent.svelte'
    import GameOverComponent from './components/GameOverComponent.svelte'
    import type { Puzzle } from './models/Puzzle'
    import type { AppSettings } from './models/AppSettings'
    import type { QuizScores } from './models/QuizScores'
    import { getQuiz } from './services/quizService'
    import { Operator } from './models/enums/Operator'
    import { GetEnumValues } from './services/enumService'
    import { PuzzleMode } from './models/enums/PuzzleMode'
    import { QuizState } from './models/enums/QuizState'
    import { getQuizScoreSum } from './services/scoreService'
    import { getData } from './services/apiService'
    import type { Quiz } from './models/Quiz'
    import type { Highscore } from './models/Highscore'
    import HighscoresComponent from './components/HighscoresComponent.svelte'

    let quizScores: QuizScores
    let highScores: Highscore[]
    let apiRequestComplete: boolean = false
    let hasHighscore: boolean
    export let apiKey: string
    export let apiEndpoint: string
    export let isProduction: string

    let appSettings: AppSettings = {
        isProduction: isProduction === 'true',
        transitionDuration: {
            duration: 200,
        },
        operators: GetEnumValues(Operator),
        operatorLabels: [
            'Addisjon',
            'Subtraksjon',
            'Multiplikasjon',
            'Divisjon',
            'Alle',
        ],
        operatorSigns: ['&#43;', '&#8722;', '&#215;', '&#247;', '&#8704'],
        puzzleModes: GetEnumValues(PuzzleMode),
        displayGreeting: true,
        apiEndpoint: apiEndpoint,
        apiKey: apiKey,
        showHighscores: false,
    }

    let puzzleSet: Puzzle[]
    let quiz = getQuiz()

    let fakeInput: any

    function getReady(event: any) {
        quiz = event.detail.quiz
        quiz.state = QuizState.AboutToStart
        appSettings.displayGreeting = false
        animateScroll.scrollToTop()
        fakeInputFocus()
    }

    function toggleShowHighscores() {
        appSettings.showHighscores = !appSettings.showHighscores
        if (!highScores) getHighscores()
    }

    function startQuiz() {
        quiz.state = QuizState.Started
    }

    function abortQuiz() {
        quiz.state = QuizState.Initial
    }

    async function completeQuiz(event: any) {
        quiz.state = QuizState.Completed
        puzzleSet = event.detail.puzzleSet

        await updateHighscores(quiz, puzzleSet)
    }

    function evaluateQuiz() {
        quiz.state = QuizState.Evaluated
    }

    function resetQuiz() {
        quiz.state = QuizState.Initial
    }

    onMount(() => {
        if (appSettings.isProduction) addAnalytics()
    })

    async function updateHighscores(quiz: Quiz, puzzleSet: Puzzle[]) {
        quizScores = getQuizScoreSum(quiz, puzzleSet)

        await getHighscores()

        if (highScores) {
            hasHighscore = userHasHighscore(highScores, quizScores)
        }
    }

    function setHighscores(event: any) {
        highScores = event.detail.highScores
    }

    async function getHighscores() {
        apiRequestComplete = false
        highScores = await getData(appSettings.apiEndpoint, appSettings.apiKey)
        apiRequestComplete = true
    }

    function userHasHighscore(
        highScores: Highscore[],
        quizScores: QuizScores
    ): boolean {
        if (quizScores.totalScore > 0 && highScores.length < 10) return true

        let lowestHighscore = Math.min(...highScores.map((o) => o.scoreSum))

        return lowestHighscore < quizScores.totalScore
    }

    function addAnalytics() {
        // Simple Web Analytics tracking code
        // https://simple-web-analytics.com/app
        if (
            !sessionStorage.getItem('_swa') &&
            document.referrer.indexOf(
                location.protocol + '//' + location.host
            ) !== 0
        ) {
            fetch(
                'https://simple-web-analytics.com/track?' +
                    new URLSearchParams({
                        referrer: document.referrer,
                        screen: screen.width + 'x' + screen.height,
                        site: 'regneflyt',
                        utcoffset: '0',
                    })
            )
        }
        sessionStorage.setItem('_swa', '1')
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
        <small class="text-base text-gray-500">1.13</small>
    </h1>
    {#if appSettings.showHighscores}
        <HighscoresComponent
            highScores="{highScores}"
            appSettings="{appSettings}"
            on:toggleShowHighscores="{toggleShowHighscores}" />
    {:else if quiz.state === QuizState.AboutToStart}
        <GetReadyComponent
            appSettings="{appSettings}"
            on:startQuiz="{startQuiz}"
            on:completeQuiz="{completeQuiz}"
            on:abortQuiz="{abortQuiz}" />
    {:else if quiz.state === QuizState.Started}
        <QuizComponent
            quiz="{quiz}"
            on:abortQuiz="{abortQuiz}"
            on:completeQuiz="{completeQuiz}"
            appSettings="{appSettings}" />
    {:else if quiz.state === QuizState.Completed}
        <GameOverComponent
            apiRequestComplete="{apiRequestComplete}"
            on:evaluateQuiz="{evaluateQuiz}" />
    {:else if quiz.state === QuizState.Evaluated}
        <ResultsComponent
            quizScores="{quizScores}"
            appSettings="{appSettings}"
            highScores="{highScores}"
            hasHighscore="{hasHighscore}"
            puzzleSet="{puzzleSet}"
            on:setHighscores="{setHighscores}"
            on:resetQuiz="{resetQuiz}" />
    {:else}
        <MenuComponent
            quiz="{quiz}"
            on:getReady="{getReady}"
            on:toggleShowHighscores="{toggleShowHighscores}"
            appSettings="{appSettings}" />
    {/if}
</main>
