<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import PuzzleComponent from './PuzzleComponent.svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import { Quiz } from '../models/Quiz'
    import { Operator } from '../models/Operator'
    import { Puzzle } from '../models/Puzzle'
    import { AnswerMode } from '../models/AnswerMode'
    import OperatorComponent from './widgets/OperatorComponent.svelte'

    export let quiz: Quiz

    const dispatch = createEventDispatcher()
    const interval = setTimeout(completeQuiz, quiz.duration * 60000)
    let showWarning = false
    let puzzleSet: Array<Puzzle> = []
    const isLocalhost = location.hostname === 'localhost'
    let activeOperator: Operator = undefined
    let unknownPuzzlePart: number

    onDestroy(() => {
        clearInterval(interval)
    })

    onMount(() => {
        activeOperator = getActiveOperator(quiz.selectedOperator)
        unknownPuzzlePart = getUnknownPuzzlePart(
            activeOperator,
            quiz.answerMode
        )
    })

    function abortQuiz() {
        dispatch('abortQuiz')
    }

    function completeQuiz() {
        dispatch('completeQuiz', { puzzleSet })
    }

    function addPuzzle(event) {
        puzzleSet = [...puzzleSet, event.detail.puzzle]
        console.log('added puzzle:', JSON.stringify(event.detail.puzzle))
        console.log('unknown puzzle part', unknownPuzzlePart)
        activeOperator = getActiveOperator(quiz.selectedOperator)
        unknownPuzzlePart = getUnknownPuzzlePart(
            activeOperator,
            quiz.answerMode
        )
    }

    function getActiveOperator(operator: Operator) {
        if (operator === Operator.All) {
            const random = Math.ceil(Math.random() * 4)

            return quiz.operators[random - 1]
        }

        return operator
    }

    function getUnknownPuzzlePart(operator: Operator, answerMode: AnswerMode) {
        switch (answerMode) {
            case AnswerMode.Random:
                if (getTrueOrFalse()) {
                    return getAlternateUnknownPuzzlePart()
                } else {
                    return 3
                }
            case AnswerMode.Alternate: {
                return getAlternateUnknownPuzzlePart()
            }
            case AnswerMode.Normal: {
                return 3
            }
        }

        function getAlternateUnknownPuzzlePart() {
            switch (operator) {
                case Operator.Addition || Operator.Subtraction:
                    return getTrueOrFalse() ? 1 : 2
                case Operator.Multiplication:
                    return 2
                case Operator.Division:
                    return 1
            }
        }

        function getTrueOrFalse() {
            // Stolen from https://stackoverflow.com/a/36756480
            return Math.random() >= 0.5
        }
    }

    function toggleWarning() {
        showWarning = !showWarning
    }
</script>

<div>
    {#if activeOperator}
        <PuzzleComponent
            {quiz}
            on:addPuzzle="{addPuzzle}"
            {activeOperator}
            {unknownPuzzlePart} />
    {/if}

    <div class="text-right float-right">
        {#if showWarning}
            <p class="mb-2 text-gray-100">Ønsker du å avbryte?</p>
            <ButtonComponent on:click="{abortQuiz}" label="ja" color="red" />
            <ButtonComponent on:click="{toggleWarning}" label="Nei" />
        {:else}
            {#if isLocalhost}
                <ButtonComponent on:click="{completeQuiz}" label="Fullfør" />
            {/if}
            <ButtonComponent
                on:click="{toggleWarning}"
                label="Avbryt"
                color="gray" />
        {/if}
    </div>
</div>
