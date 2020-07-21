<script lang="ts">
    import MenuComponent from './components/MenuComponent.svelte'
    import ResultsComponent from './components/ResultsComponent.svelte'
    import QuizComponent from './components/QuizComponent.svelte'
    import { Operator } from './models/Operator'
    import { Quiz } from './models/Quiz'
    import { Puzzle } from './models/Puzzle'

    const urlParams = new URLSearchParams(window.location.search)

    function getIntParam(param: string): number {
        return parseInt(urlParams.get(param))
    }

    function getBoolParam(param: string): boolean {
        return urlParams.get(param) === 'false' ? false : true
    }

    function getOperatorParam(param: string): Operator {
        return urlParams.get(param) as Operator
    }

    function getNumArrayParam(param: string): Array<number> {
        var array = urlParams.get(param)

        return array && array !== 'null' ? array.split(',').map(Number) : []
    }

    let quiz: Quiz = {
        duration: getIntParam('duration') || 1,
        puzzleTimeLimit: getIntParam('timeLimit') || 0,
        partOne: {
            minValue: getIntParam('partOneMin') || 1,
            maxValue: getIntParam('partOneMax') || 20,
            randomize: getBoolParam('partOneRandom'),
            possibleValues: getNumArrayParam('partOneValues'),
        },
        partTwo: {
            minValue: getIntParam('partTwoMin') || 1,
            maxValue: getIntParam('partTwoMax') || 20,
            randomize: getBoolParam('partTwoRandom'),
            possibleValues: getNumArrayParam('partTwoValues'),
        },
        isStarted: false,
        isCompleted: false,
        selectedOperator: getOperatorParam('operator') || Operator.Addition,
        allowNegativeAnswer: getBoolParam('negatives'),
        activeOperator: undefined,
        operators: [
            Operator.Addition,
            Operator.Subtraction,
            Operator.Multiplication,
            Operator.Division,
            Operator.All,
        ],
    }

    let puzzleSet: Array<Puzzle>
    let displayGreeting = true

    function startQuiz(event) {
        quiz = event.detail.quiz
        quiz.isStarted = true
        displayGreeting = false
    }

    function abortQuiz() {
        quiz.isStarted = false
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
    {:else if quiz.isStarted}
        <QuizComponent
            {quiz}
            on:abortQuiz="{abortQuiz}"
            on:completeQuiz="{completeQuiz}" />
    {:else}
        <MenuComponent {quiz} on:startQuiz="{startQuiz}" />
    {/if}
</main>
