<script lang="ts">
    import Tailwindcss from './Tailwind.svelte'
    import { onMount } from 'svelte'
    import type { Highscore } from './models/Highscore'
    import * as animateScroll from 'svelte-scrollto'
    import MenuComponent from './components/MenuComponent.svelte'
    import ResultsComponent from './components/ResultsComponent.svelte'
    import QuizComponent from './components/QuizComponent.svelte'
    import GetReadyComponent from './components/GetReadyComponent.svelte'
    import GameOverComponent from './components/GameOverComponent.svelte'
    import type { Puzzle } from './models/Puzzle'
    import type { QuizScores } from './models/QuizScores'
    import { getQuiz } from './services/quizService'
    import {
        addAnalytics,
        fakeInputFocus,
        getAppSettings,
    } from './services/appService'
    import { QuizState } from './models/constants/QuizState'
    import {
        getQuizScoreSum,
        getHighscorePosition,
    } from './services/scoreService'
    import { getData } from './services/apiService'
    import type { Quiz } from './models/Quiz'
    import HighscoresComponent from './components/HighscoresComponent.svelte'

    export let apiKey: string
    export let apiEndpoint: string
    export let isProduction: string

    let quizScores: QuizScores
    let highScores: Highscore[]
    let apiRequestComplete: boolean = false
    let highscorePosition: number | undefined
    let appSettings = getAppSettings(isProduction, apiEndpoint, apiKey)
    let puzzleSet: Puzzle[]
    let quiz = getQuiz()
    let fakeInput: any
    let userHighScore: Highscore = {
        scoreSum: 0,
        name: '',
    }

    function getReady(event: any) {
        quiz = event.detail.quiz
        quiz.state = QuizState.AboutToStart
        appSettings.displayGreeting = false
        animateScroll.scrollToTop()
        fakeInputFocus(fakeInput)
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

        highscorePosition = getHighscorePosition(highScores, quizScores)

        if (highscorePosition) userHighScore.scoreSum = quizScores.totalScore
    }

    function setHighscores(event: any) {
        highScores = event.detail.highScores
    }

    async function getHighscores() {
        apiRequestComplete = false
        highScores = await getData(appSettings.apiEndpoint, appSettings.apiKey)
        apiRequestComplete = true
    }
</script>

<main class="container max-w-xl mx-auto px-2 md:px-3 pt-1 pb-2 md:pb-5">
    <h1 class="text-2xl md:text-3xl font-light text-orange-600 mb-1 text-right">
        Regneflyt
        <small class="text-base text-gray-500">1.25</small>
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
            highscorePosition="{highscorePosition}"
            userHighScore="{userHighScore}"
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
