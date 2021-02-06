<script lang="ts">
    import Tailwindcss from './Tailwind.svelte'
    import * as animateScroll from 'svelte-scrollto'
    import MenuComponent from './components/MenuComponent.svelte'
    import ResultsComponent from './components/ResultsComponent.svelte'
    import QuizComponent from './components/QuizComponent.svelte'
    import GameOverComponent from './components/GameOverComponent.svelte'
    import type { Puzzle } from './models/Puzzle'
    import { getQuizScoreSum } from './services/scoreService'
    import type { QuizScores } from './models/QuizScores'
    import { getQuiz } from './services/quizService'
    import { fakeInputFocus, getAppSettings } from './services/appService'
    import { QuizState } from './models/constants/QuizState'
    import { getRandomNumber } from './services/randomService'

    export let isProduction: string
    export let version: string

    let quizScores: QuizScores
    let appSettings = getAppSettings(isProduction)
    let puzzleSet: Puzzle[]
    let quiz = getQuiz()
    let fakeInput: any

    let random = getRandomNumber(1, 100)

    for (let index = 0; index < 10; index++) {
        // console.log(randIntIncl(1, 100))
        // const restoredRandom = getRandomNumber(1, 100, 'hei', random.state)
        console.log(getRandomNumber(1, 100, undefined, random.state))
    }

    function getReady(event: any) {
        quiz = event.detail?.quiz ?? quiz
        quiz.state = QuizState.AboutToStart
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

    function completeQuiz(event: any) {
        quiz.state = QuizState.Completed
        puzzleSet = event.detail.puzzleSet
        quizScores = getQuizScoreSum(quiz, puzzleSet)
    }

    function evaluateQuiz() {
        quiz.state = QuizState.Evaluated
    }

    function resetQuiz(event: any) {
        quiz.state = QuizState.Initial
        quiz.previousScore = event.detail.previousScore
        animateScroll.scrollToTop()
    }
</script>

<div class="container mx-auto max-w-lg px-1 md:px-3 py-1 md:py-2">
    <header>
        <h1 class="text-right -mb-1">
            <span class="font-handwriting text-3xl md:text-4xl text-orange-500"
                >Regneflyt</span
            >
            <small class="font-light text-xs text-gray-400"
                ><a href="https://github.com/vaags/regneflyt-frontend"
                    >{version}</a
                ></small
            >
        </h1>
    </header>
    <main>
        {#if quiz.state === QuizState.AboutToStart || quiz.state === QuizState.Started}
            <QuizComponent
                quiz="{quiz}"
                on:startQuiz="{startQuiz}"
                on:abortQuiz="{abortQuiz}"
                on:completeQuiz="{completeQuiz}"
                appSettings="{appSettings}"
            />
        {:else if quiz.state === QuizState.Completed}
            <GameOverComponent
                on:evaluateQuiz="{evaluateQuiz}"
                appSettings="{appSettings}"
            />
        {:else if quiz.state === QuizState.Evaluated}
            <ResultsComponent
                quiz="{quiz}"
                quizScores="{quizScores}"
                appSettings="{appSettings}"
                puzzleSet="{puzzleSet}"
                on:getReady="{getReady}"
                on:resetQuiz="{resetQuiz}"
            />
        {:else}
            <MenuComponent
                quiz="{quiz}"
                on:getReady="{getReady}"
                appSettings="{appSettings}"
            />
        {/if}
    </main>
</div>
