<script lang="ts">
    import Tailwindcss from './Tailwind.svelte'
    import { onMount } from 'svelte'
    import * as animateScroll from 'svelte-scrollto'
    import MenuComponent from './components/MenuComponent.svelte'
    import ResultsComponent from './components/ResultsComponent.svelte'
    import QuizComponent from './components/QuizComponent.svelte'
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
    export let version: string

    let quizScores: QuizScores
    let appSettings = getAppSettings(isProduction)
    let puzzleSet: Puzzle[]
    let quiz = getQuiz()
    let fakeInput: any

    function getReady(event: any) {
        quiz = event.detail?.quiz ?? quiz
        quiz.state = QuizState.AboutToStart
        appSettings.displayGreeting = false
        appSettings.menuFade = true
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

<div class="container max-w-xl mx-auto px-2 md:px-3 pt-1 md:pt-2 pb-2 md:pb-5">
    <header>
        <h1 class="font-light text-right">
            <span
                class="text-3xl md:text-4xl tracking-tight text-orange-500">Regneflyt</span>
            <small class="text-xs md:text-sm text-gray-400">{version}</small>
        </h1>
    </header>
    <main class="relative">
        {#if quiz.state === QuizState.AboutToStart || quiz.state === QuizState.Started}
            <QuizComponent
                quiz="{quiz}"
                on:startQuiz="{startQuiz}"
                on:abortQuiz="{abortQuiz}"
                on:completeQuiz="{completeQuiz}"
                appSettings="{appSettings}" />
        {:else if quiz.state === QuizState.Completed}
            <GameOverComponent
                on:evaluateQuiz="{evaluateQuiz}"
                appSettings="{appSettings}" />
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
</div>
