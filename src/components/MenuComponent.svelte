<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { slide } from 'svelte/transition'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import RangeComponent from './widgets/RangeComponent.svelte'
    import LabelComponent from './widgets/LabelComponent.svelte'
    import { Operator } from '../models/enums/Operator'
    import type { Quiz } from '../models/Quiz'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import { getPuzzle } from '../services/puzzleService'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import { setUrlParams } from '../services/quizService'
    import PuzzlePreviewComponent from './widgets/PuzzlePreviewComponent.svelte'
    import PuzzleModeComponent from './widgets/PuzzleModeComponent.svelte'
    import NumberInputComponent from './widgets/NumberInputComponent.svelte'
    import type { AppSettings } from '../models/AppSettings'

    export let appSettings: AppSettings
    export let quiz: Quiz
    let puzzle = getPuzzle(quiz, undefined)
    const dispatch = createEventDispatcher()
    let invalidInputs: string[] = []
    let invalidNumberInputs: boolean

    function validateNumberInput(event: any) {
        toggleInvalidFields(event.detail.id, event.detail.isValid)
    }

    function toggleInvalidFields(id: string, isValid: boolean) {
        var idx = invalidInputs.indexOf(id)
        if (idx >= 0 && isValid) {
            invalidInputs.splice(idx, 1)
        } else if (idx < 0 && !isValid) {
            invalidInputs.push(id)
        }
        invalidNumberInputs = invalidInputs.length > 0
    }

    $: isMultiplication = quiz.selectedOperator === Operator.Multiplication
    $: isDivision = quiz.selectedOperator === Operator.Division
    $: isAllOperators = quiz.selectedOperator === Operator.All
    $: hasPuzzleTimeLimit = quiz.puzzleTimeLimit > 0

    $: validationMultiplicationError =
        (isMultiplication || isAllOperators) &&
        quiz.partSettings[Operator.Multiplication].partOne.possibleValues
            ?.length == 0

    $: validationDivisionError =
        (isDivision || isAllOperators) &&
        quiz.partSettings[Operator.Division].partTwo.possibleValues?.length == 0

    $: validationError =
        invalidNumberInputs ||
        validationMultiplicationError ||
        validationDivisionError

    function getReady() {
        if (validationError) return

        dispatch('getReady', { quiz })
    }

    function getPuzzlePreview() {
        puzzle = getPuzzle(quiz, puzzle)
    }

    function updateQuizSettings(updatePuzzlePreview: boolean = true) {
        if (!validationError) {
            setUrlParams(quiz)
            if (updatePuzzlePreview) getPuzzlePreview()
        }
    }

    function togglePuzzleTimeLimit() {
        quiz.puzzleTimeLimit === 0
            ? (quiz.puzzleTimeLimit = 5)
            : (quiz.puzzleTimeLimit = 0)

        updateQuizSettings(false)
    }

    onMount(() => {
        updateQuizSettings()
    })
</script>

{#if appSettings.displayGreeting}
    <div class="card" transition:slide|local="{appSettings.transitionDuration}">
        <p class="mb-2">
            Regneflyt er et mattespill som trener deg i hoderegning.
        </p>
        <p>
            Velg hvordan du vil trene nedenfor. Ved spillets slutt vil du få en
            vurdering.
        </p>
    </div>
{/if}

<form>
    <div class="card">
        <h2>Regneart</h2>
        {#each appSettings.operators as operator}
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
            <div
                class="mt-4 mb-2"
                transition:slide|local="{appSettings.transitionDuration}">
                <AlertComponent
                    message="De valgte innstillingene for alle fire regnearter
                    vil bli brukt." />
            </div>
        {:else if quiz.selectedOperator === Operator.Subtraction}
            <div transition:slide|local="{appSettings.transitionDuration}">
                <label class="inline-flex items-center mt-4">
                    <input
                        type="checkbox"
                        class="form-checkbox text-blue-700 h-5 w-5
                        border-gray-500"
                        on:change="{() => updateQuizSettings()}"
                        bind:checked="{quiz.allowNegativeAnswer}" />
                    <span class="ml-2">Tillat negative svar</span>
                </label>
            </div>
        {/if}
    </div>
    {#if !isAllOperators}
        <div
            transition:slide|local="{appSettings.transitionDuration}"
            class="mb-3">
            <div class="card">
                <LabelComponent>
                    <OperatorComponent
                        returnName="{true}"
                        operator="{quiz.selectedOperator}" />
                </LabelComponent>
                <h2>
                    {#if isMultiplication}
                        Multiplikand
                    {:else if isDivision}
                        Dividend
                        <small>(intervall)</small>
                    {:else}
                        Første ledd
                        <small>(intervall)</small>
                    {/if}
                </h2>
                <div class="mb-6">
                    {#if isMultiplication}
                        <div
                            transition:slide|local="{appSettings.transitionDuration}">
                            {#each Array(10) as _, i}
                                <label class="flex items-center py-1">
                                    <input
                                        type="checkbox"
                                        class="form-checkbox text-blue-700 h-5
                                        w-5 border-gray-500"
                                        on:change="{() => updateQuizSettings()}"
                                        bind:group="{quiz.partSettings[Operator.Multiplication].partOne.possibleValues}"
                                        value="{i + 1}" />
                                    <span class="ml-2">{i + 1}</span>
                                </label>
                            {/each}
                        </div>
                    {:else}
                        <div
                            transition:slide|local="{appSettings.transitionDuration}">
                            <div class="flex flex-row">
                                <label class="mr-4" for="partOneMin">
                                    Fra og med
                                    <NumberInputComponent
                                        id="{quiz.selectedOperator}-1-min"
                                        on:change="{() => updateQuizSettings()}"
                                        on:isValid="{validateNumberInput}"
                                        max="{quiz.partSettings[quiz.selectedOperator].partOne.maxValue - 1 || 1000}"
                                        bind:value="{quiz.partSettings[quiz.selectedOperator].partOne.minValue}" />
                                </label>
                                <label for="partOneMax">
                                    Til og med
                                    <NumberInputComponent
                                        id="{quiz.selectedOperator}-1-max"
                                        on:change="{() => updateQuizSettings()}"
                                        on:isValid="{validateNumberInput}"
                                        min="{quiz.partSettings[quiz.selectedOperator].partOne.minValue + 1 || -1000}"
                                        bind:value="{quiz.partSettings[quiz.selectedOperator].partOne.maxValue}" />
                                </label>
                            </div>
                            {#if isDivision}
                                <div
                                    class="mt-4"
                                    transition:slide|local="{appSettings.transitionDuration}">
                                    <AlertComponent
                                        message="Intervallverdi ganget med
                                        divisor" />
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
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
                {#if isDivision}
                    <div
                        transition:slide|local="{appSettings.transitionDuration}">
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
                    </div>
                {:else}
                    <div
                        transition:slide|local="{appSettings.transitionDuration}"
                        class="flex flex-row">
                        <label for="partTwoFrom" class="mr-4">
                            Fra og med
                            <NumberInputComponent
                                id="{quiz.selectedOperator}-2-min"
                                max="{quiz.partSettings[quiz.selectedOperator].partTwo.maxValue - 1 || 1000}"
                                on:change="{() => updateQuizSettings()}"
                                on:isValid="{validateNumberInput}"
                                bind:value="{quiz.partSettings[quiz.selectedOperator].partTwo.minValue}" />
                        </label>
                        <label for="partTwoTo">
                            Til og med
                            <NumberInputComponent
                                id="{quiz.selectedOperator}-2-max"
                                min="{quiz.partSettings[quiz.selectedOperator].partTwo.minValue + 1 || -1000}"
                                on:change="{() => updateQuizSettings()}"
                                on:isValid="{validateNumberInput}"
                                bind:value="{quiz.partSettings[quiz.selectedOperator].partTwo.maxValue}" />
                        </label>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
    <div class="card">
        <h2>Oppgaveform</h2>
        {#each appSettings.puzzleModes as puzzleMode}
            <label class="flex items-center py-1">
                <input
                    type="radio"
                    class="form-radio h-5 w-5 text-blue-700 border-gray-500 mr-2"
                    bind:group="{quiz.puzzleMode}"
                    on:change="{() => updateQuizSettings()}"
                    value="{puzzleMode}" />
                <PuzzleModeComponent {puzzleMode} />
            </label>
        {/each}
    </div>
    <div class="card">
        <h2>Forhåndsvisning</h2>
        {#if validationError}
            <div transition:slide|local="{appSettings.transitionDuration}">
                <AlertComponent
                    color="yellow"
                    message="Kan ikke vise forhåndsvisning." />
            </div>
        {:else}
            <div transition:slide|local="{appSettings.transitionDuration}">
                <div class="text-center text-2xl md:text-3xl">
                    <PuzzlePreviewComponent {puzzle} />
                </div>
                <div class="text-right">
                    <button
                        type="button"
                        class="text-3xl cursor-pointer focus:outline-none"
                        title="Nytt oppgave-eksempel"
                        on:click="{() => getPuzzlePreview()}">
                        🎲
                    </button>
                </div>
            </div>
        {/if}
    </div>
    <div class="card">
        <h2>Spilletid</h2>
        <label for="duration" class="sr-only">Totalt:</label>
        <RangeComponent
            min="{0.5}"
            max="{10}"
            id="duration"
            step="{0.5}"
            unitLabel=" min"
            largeLabel="{true}"
            on:change="{() => updateQuizSettings(false)}"
            bind:value="{quiz.duration}" />
        <div class="mt-4">
            <label class="inline-flex items-center">
                <input
                    id="hasLimit"
                    type="checkbox"
                    class="form-checkbox text-blue-700 h-5 w-5 border-gray-500"
                    on:change="{() => togglePuzzleTimeLimit()}"
                    bind:checked="{hasPuzzleTimeLimit}" />
                <span class="ml-2">Tidsbegrensning per oppgave</span>
            </label>
            {#if quiz.puzzleTimeLimit}
                <div
                    class="mt-1"
                    transition:slide|local="{appSettings.transitionDuration}">
                    <label class="sr-only" for="puzzleLimit">
                        Antall sekunder per oppgave
                    </label>
                    <RangeComponent
                        id="puzzleLimit"
                        min="{3}"
                        max="{10}"
                        unitLabel=" s"
                        on:change="{() => updateQuizSettings(false)}"
                        bind:value="{quiz.puzzleTimeLimit}" />
                </div>
            {/if}
        </div>
    </div>
    <ButtonComponent
        label="Start"
        on:click="{() => getReady()}"
        color="{validationError ? 'red' : 'green'}" />
</form>
