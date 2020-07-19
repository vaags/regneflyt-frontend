<script>
    import Menu from './components/Menu.svelte'
    import Results from './components/Results.svelte'
    import Quiz from './components/Quiz.svelte'

    const urlParams = new URLSearchParams(window.location.search)

    function getIntParam(param) {
        return parseInt(urlParams.get(param))
    }

    function getBoolParam(param) {
        return urlParams.get(param) === 'false' ? false : true
    }

    function getNumArrayParam(param) {
        var array = urlParams.get(param)

        return array && array !== 'null' ? array.split(',').map(Number) : []
    }

    let quiz = {
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
        operators: [
            'Addisjon',
            'Subtraksjon',
            'Multiplikasjon',
            'Divisjon',
            'Alle',
        ],
        selectedOperator: urlParams.get('operator') || 'addisjon',
        allowNegativeAnswer: getBoolParam('negatives'),
        activeOperator: undefined,
    }

    let puzzleSet
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

<main class="container max-w-xl mx-auto px-3 pt-1 pb-5">
    <h1 class="text-4xl font-light text-orange-600 mb-2 text-right">
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
        <Results {puzzleSet} on:resetQuiz="{resetQuiz}" />
    {:else if quiz.isStarted}
        <Quiz
            {quiz}
            on:abortQuiz="{abortQuiz}"
            on:completeQuiz="{completeQuiz}" />
    {:else}
        <Menu {quiz} on:startQuiz="{startQuiz}" />
    {/if}
</main>
