<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import RangeComponent from './widgets/RangeComponent.svelte'
    import { Operator } from '../models/enums/Operator'
    import type { Quiz } from '../models/Quiz'
    import { AnswerMode } from '../models/enums/AnswerMode'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import { getPuzzle } from '../services/puzzleService'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import { setUrlParams } from '../services/quizService'
    import HiddenValueComponent from './widgets/HiddenValueComponent.svelte'

    export let quiz: Quiz
    let puzzle = getPuzzle(quiz, undefined)
    let showHiddenValue: boolean = false

    const dispatch = createEventDispatcher()

    $: isDivision = quiz.selectedOperator === Operator.Division
    $: isMultiplication = quiz.selectedOperator === Operator.Multiplication
    $: isAllOperators = quiz.selectedOperator === Operator.All

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

    onMount(() => {
        updateQuizSettings()
    })
</script>

<form>
    <div class="card">
        <h2>Spilletid</h2>
        <label>
            Totalt:
            <span class="text-sm">(i minutter)</span>
            <br />
            <RangeComponent
                min="{0.5}"
                max="{15}"
                step="{0.5}"
                on:change="{() => updateQuizSettings()}"
                bind:value="{quiz.duration}" />
        </label>
        <label class="inline-flex items-center mt-3">
            <input
                type="checkbox"
                class="form-checkbox text-blue-700 h-5 w-5 border-gray-500"
                on:change="{() => updateQuizSettings()}"
                bind:checked="{quiz.showRemainingTime}" />
            <span class="ml-2">Vis gjenværende tid</span>
        </label>

        <label class="block mt-4">
            Per oppgave:
            <span class="text-sm">(i sekunder)</span>
            <br />
            <RangeComponent
                zeroLabel="&#8734;"
                min="{0}"
                max="{10}"
                on:change="{() => updateQuizSettings()}"
                bind:value="{quiz.puzzleTimeLimit}" />
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
        {#if quiz.selectedOperator === Operator.All}
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
    {#if quiz.selectedOperator !== Operator.All}
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
                {:else if quiz.selectedOperator !== Operator.All}
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
        <h2>Ukjent ledd</h2>
        <label class="flex items-center py-1">
            <input
                type="radio"
                class="form-radio h-5 w-5 text-blue-700 border-gray-500"
                bind:group="{quiz.answerMode}"
                on:change="{() => updateQuizSettings()}"
                value="{AnswerMode.Normal}" />
            <span class="ml-2">
                {AnswerMode.Normal}
                <span class="text-sm">(Svaret er ukjent)</span>
            </span>
        </label>
        <label class="flex items-center py-1">
            <input
                type="radio"
                class="form-radio h-5 w-5 text-blue-700 border-gray-500"
                bind:group="{quiz.answerMode}"
                on:change="{() => updateQuizSettings()}"
                value="{AnswerMode.Alternate}" />
            <span class="ml-2">
                {AnswerMode.Alternate}
                <span class="text-sm">(Første eller andre ledd er ukjent)</span>
            </span>
        </label>
        <label class="flex items-center py-1">
            <input
                type="radio"
                class="form-radio h-5 w-5 text-blue-700 border-gray-500"
                bind:group="{quiz.answerMode}"
                on:change="{() => updateQuizSettings()}"
                value="{AnswerMode.Random}" />
            <span class="ml-2">{AnswerMode.Random}</span>
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
