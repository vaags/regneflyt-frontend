<script lang="ts">
    import MenuComponent from './components/MenuComponent.svelte'
    import ResultsComponent from './components/ResultsComponent.svelte'
    import QuizComponent from './components/QuizComponent.svelte'
    import type { Puzzle } from './models/Puzzle'
    import { getQuiz } from './services/quizService'

    let puzzleSet: Array<Puzzle>
    let displayGreeting = true
    let quiz = getQuiz()

    function startQuiz(event) {
        quiz = event.detail.quiz
        quiz.isAboutToStart = true
        displayGreeting = false
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
</script>

<main class="container max-w-xl mx-auto px-2 md:px-3 pt-1 pb-2 md:pb-5">
    <h1 class="text-3xl md:text-4xl font-light text-orange-600 mb-1 text-right">
        Regneflyt
    </h1>
    {#if displayGreeting}
        <div class="card text-gray-700">
            <p class="mb-2">Regneflyt trener deg i hoderegning.</p>
            <p>
                Velg hvordan du ønsker å trene nedenfor. Når tiden er ute vil du
                få en vurdering.
            </p>
        </div>
    {/if}
    {#if quiz.isCompleted}
        <ResultsComponent {puzzleSet} on:resetQuiz="{resetQuiz}" />
    {:else if quiz.isAboutToStart || quiz.isStarted}
        <QuizComponent
            {quiz}
            on:abortQuiz="{abortQuiz}"
            on:completeQuiz="{completeQuiz}" />
    {:else}
        <MenuComponent {quiz} on:startQuiz="{startQuiz}" />
    {/if}
</main>
