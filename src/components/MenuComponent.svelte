<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import RangeComponent from './widgets/RangeComponent.svelte'
    import { Operator } from '../models/enums/Operator'
    import type { Quiz } from '../models/Quiz'
    import { PuzzleMode } from '../models/enums/PuzzleMode'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import { getPuzzle } from '../services/puzzleService'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import { setUrlParams } from '../services/quizService'
    import HiddenValueComponent from './widgets/HiddenValueComponent.svelte'

    export let quiz: Quiz
    let puzzle = getPuzzle(quiz, undefined)
    let showHiddenValue: boolean = false
    let hasPuzzleTimeLimit: boolean

    const dispatch = createEventDispatcher()

    $: isDivision = quiz.selectedOperator === Operator.Division
    $: isMultiplication = quiz.selectedOperator === Operator.Multiplication
    $: isMultiplicationOrDivision = isDivision || isMultiplication
    $: isAllOperators = quiz.selectedOperator === Operator.All
    $: hasPuzzleTimeLimit = quiz.puzzleTimeLimit > 0

    $: validationError =
        ((isMultiplication || isAllOperators) &&
            quiz.partSettings[Operator.Multiplication].partOne.possibleValues
                ?.length == 0) ||
        ((isDivision || isAllOperators) &&
            quiz.partSettings[Operator.Division].partTwo.possibleValues
                ?.length == 0)

    function startQuiz() {
        if (validationError) return

        dispatch('startQuiz', { quiz })
    }

    function getPuzzlePreview() {
        showHiddenValue = false
        puzzle = getPuzzle(quiz, puzzle)
    }

    function updateQuizSettings() {
        if (!validationError) {
            setUrlParams(quiz)
            getPuzzlePreview()
        }
    }

    function togglePuzzleTimeLimit() {
        quiz.puzzleTimeLimit === 0
            ? (quiz.puzzleTimeLimit = 3)
            : (quiz.puzzleTimeLimit = 0)

        updateQuizSettings()
    }

    onMount(() => {
        updateQuizSettings()
    })
</script>

<form>
    <div class="card">
        <h2>Spilletid</h2>
        <label for="duration" class="sr-only">Totalt:</label>
        <RangeComponent
            min="{0.5}"
            max="{10}"
            id="duration"
            step="{0.5}"
            unitLabel=" min"
            paddingTop="{false}"
            largeLabel="{true}"
            on:change="{() => updateQuizSettings()}"
            bind:value="{quiz.duration}" />
        <label class="inline-flex items-center mt-4">
            <input
                type="checkbox"
                class="form-checkbox text-blue-700 h-5 w-5 border-gray-500"
                on:change="{() => updateQuizSettings()}"
                bind:checked="{quiz.showRemainingTime}" />
            <span class="ml-2">Vis gjenværende tid</span>
        </label>
        <label class="block mt-4">
            <label class="inline-flex items-center">
                <input
                    type="checkbox"
                    class="form-checkbox text-blue-700 h-5 w-5 border-gray-500"
                    on:change="{() => togglePuzzleTimeLimit()}"
                    bind:checked="{hasPuzzleTimeLimit}" />
                <span class="ml-2">
                    Tidsbegrensning per oppgave{quiz.puzzleTimeLimit ? ':' : ''}
                </span>
            </label>
            {#if quiz.puzzleTimeLimit}
                <br />
                <RangeComponent
                    min="{3}"
                    max="{10}"
                    unitLabel=" s"
                    on:change="{() => updateQuizSettings()}"
                    bind:value="{quiz.puzzleTimeLimit}" />
            {/if}
        </label>
    </div>
    <div class="card">
        <h2>Regneart</h2>
        {#each quiz.operators as operator}
            <label class="flex items-center py-1">
                <input
                    type="radio"
                    class="form-radio h-5 w-5 text-blue-700 border-gray-500"
                    bind:group="{quiz.selectedOperator}"
                    value="{operator}"
                    on:change="{() => updateQuizSettings()}" />
                <span class="ml-2">
                    <OperatorComponent {operator} returnName="{true}" />
                </span>
            </label>
        {/each}
        {#if isAllOperators}
            <AlertComponent
                message="De valgte innstillingene for alle fire regnearter vil
                bli brukt."
                bottomMargin="{false}" />
        {/if}
        {#if quiz.selectedOperator === Operator.Subtraction}
            <label class="inline-flex items-center mt-4">
                <input
                    type="checkbox"
                    class="form-checkbox text-blue-700 h-5 w-5 border-gray-500"
                    on:change="{() => updateQuizSettings()}"
                    bind:checked="{quiz.allowNegativeAnswer}" />
                <span class="ml-2">Tillat negative svar</span>
            </label>
        {/if}
    </div>
    {#if !isAllOperators}
        <div class="card">
            <h2>
                {#if isMultiplication}
                    Multiplikand
                {:else if quiz.selectedOperator === Operator.Division}
                    Dividend
                    <small>(intervall)</small>
                {:else}
                    Første ledd
                    <small>(intervall)</small>
                {/if}
            </h2>
            <div>
                {#if isMultiplication}
                    {#each Array(10) as _, i}
                        <label class="flex items-center py-1">
                            <input
                                type="checkbox"
                                class="form-checkbox text-blue-700 h-5 w-5
                                border-gray-500"
                                on:change="{() => updateQuizSettings()}"
                                bind:group="{quiz.partSettings[Operator.Multiplication].partOne.possibleValues}"
                                value="{i + 1}" />
                            <span class="ml-2">{i + 1}</span>
                        </label>
                    {/each}
                {:else if !isAllOperators}
                    {#if isDivision}
                        <AlertComponent
                            message="Intervallverdi ganget med divisor" />
                    {/if}
                    <label>
                        Fra og med:
                        <br />
                        <RangeComponent
                            max="{quiz.partSettings[quiz.selectedOperator].partOne.maxValue - 1}"
                            on:change="{() => updateQuizSettings()}"
                            bind:value="{quiz.partSettings[quiz.selectedOperator].partOne.minValue}" />
                    </label>
                    <label class="block mt-4">
                        Til og med:
                        <br />
                        <RangeComponent
                            min="{quiz.partSettings[quiz.selectedOperator].partOne.minValue + 1}"
                            on:change="{() => updateQuizSettings()}"
                            bind:value="{quiz.partSettings[quiz.selectedOperator].partOne.maxValue}" />
                    </label>
                {/if}
            </div>
        </div>
        <div class="card">
            <h2>
                {#if isMultiplication}
                    Multiplikator
                    <small>(intervall)</small>
                {:else if isDivision}
                    Divisor
                {:else}
                    Andre ledd
                    <small>(intervall)</small>
                {/if}
            </h2>
            <div>
                {#if isDivision}
                    {#each Array(10) as _, i}
                        <label class="flex items-center py-1">
                            <input
                                type="checkbox"
                                class="form-checkbox text-blue-700 h-5 w-5
                                border-gray-500"
                                on:change="{() => updateQuizSettings()}"
                                bind:group="{quiz.partSettings[Operator.Division].partTwo.possibleValues}"
                                value="{i + 1}" />
                            <span class="ml-2">{i + 1}</span>
                        </label>
                    {/each}
                {:else if quiz.selectedOperator !== Operator.All}
                    <label>
                        Fra og med:
                        <br />
                        <RangeComponent
                            max="{quiz.partSettings[quiz.selectedOperator].partTwo.maxValue - 1}"
                            on:change="{() => updateQuizSettings()}"
                            bind:value="{quiz.partSettings[quiz.selectedOperator].partTwo.minValue}" />
                    </label>
                    <label class="block mt-4">
                        Til og med:
                        <br />
                        <RangeComponent
                            min="{quiz.partSettings[quiz.selectedOperator].partTwo.minValue + 1}"
                            on:change="{() => updateQuizSettings()}"
                            bind:value="{quiz.partSettings[quiz.selectedOperator].partTwo.maxValue}" />
                    </label>
                {/if}
            </div>
        </div>
    {/if}
    <div class="card">
        <h2>Oppgaveform</h2>
        <label class="flex items-center py-1">
            <input
                type="radio"
                class="form-radio h-5 w-5 text-blue-700 border-gray-500"
                bind:group="{quiz.puzzleMode}"
                on:change="{() => updateQuizSettings()}"
                value="{PuzzleMode.Normal}" />
            <span class="ml-2">
                Normal
                <span class="text-sm">(Svaret er ukjent)</span>
            </span>
        </label>
        <label class="flex items-center py-1">
            <input
                type="radio"
                class="form-radio h-5 w-5 text-blue-700 border-gray-500"
                bind:group="{quiz.puzzleMode}"
                on:change="{() => updateQuizSettings()}"
                value="{PuzzleMode.Alternate}" />
            <span class="ml-2">
                Omvendt
                <span class="text-sm">(Første eller andre ledd er ukjent)</span>
            </span>
        </label>
        <label class="flex items-center py-1">
            <input
                type="radio"
                class="form-radio h-5 w-5 text-blue-700 border-gray-500"
                bind:group="{quiz.puzzleMode}"
                on:change="{() => updateQuizSettings()}"
                value="{PuzzleMode.Random}" />
            <span class="ml-2">Tilfeldig</span>
        </label>
    </div>
    <div class="card">
        <h2>Forhåndsvisning</h2>
        {#if validationError}
            <AlertComponent
                color="yellow"
                message="Kan ikke vise forhåndsvisning." />
        {:else}
            <div class="text-center text-2xl md:text-3xl">
                {#each puzzle.parts as part, i}
                    {#if puzzle.unknownPuzzlePartNumber === i}
                        <span
                            on:click="{() => (showHiddenValue = !showHiddenValue)}">
                            <HiddenValueComponent
                                hiddenValue="{part.generatedValue}"
                                {showHiddenValue}
                                value="?" />
                        </span>
                    {:else}
                        <span>{part.generatedValue}</span>
                    {/if}
                    {#if i === 0}
                        <span>
                            <OperatorComponent operator="{puzzle.operator}" />
                        </span>
                    {:else if i === 1}
                        <span class="mr-2">=</span>
                    {/if}
                {/each}
            </div>
            <div class="text-right">
                <button
                    type="button"
                    class="text-3xl cursor-pointer focus:outline-none"
                    on:click="{() => getPuzzlePreview()}">
                    &#127922;
                </button>
            </div>
        {/if}
    </div>
    <ButtonComponent
        label="Start"
        on:click="{() => startQuiz()}"
        color="{validationError ? 'red' : 'green'}" />
</form>
