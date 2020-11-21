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
    import { getQuizScoreSum } from './services/scoreService'
    import type { QuizScores } from './models/QuizScores'
    import { getQuiz } from './services/quizService'
    import {
        addAnalytics,
        fakeInputFocus,
        getAppSettings,
    } from './services/appService'
    import { QuizState } from './models/constants/QuizState'

    export let isProduction: string

    let quizScores: QuizScores
    let appSettings = getAppSettings(isProduction)
    let puzzleSet: Puzzle[]
    let quiz = getQuiz()
    let fakeInput: any

    function getReady(event: any) {
        quiz = event.detail?.quiz ?? quiz
        quiz.state = QuizState.AboutToStart
        appSettings.displayGreeting = false
        animateScroll.scrollToTop()
        fakeInputFocus(fakeInput)
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
        quizScores = getQuizScoreSum(quiz, puzzleSet)
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
</script>

<main class="container max-w-xl mx-auto px-2 md:px-3 pt-2 pb-2 md:pb-5">
    <h1 class="text-2xl md:text-3xl font-light text-orange-500 mb-2 text-right">
        Regneflyt
        <small class="text-sm md:text-base text-gray-400">1.35</small>
    </h1>
    {#if quiz.state === QuizState.AboutToStart}
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
        <GameOverComponent on:evaluateQuiz="{evaluateQuiz}" />
    {:else if quiz.state === QuizState.Evaluated}
        <ResultsComponent
            quizScores="{quizScores}"
            appSettings="{appSettings}"
            puzzleSet="{puzzleSet}"
            on:getReady="{getReady}"
            on:resetQuiz="{resetQuiz}" />
    {:else}
        <MenuComponent
            quiz="{quiz}"
            on:getReady="{getReady}"
            appSettings="{appSettings}" />
    {/if}
</main>
