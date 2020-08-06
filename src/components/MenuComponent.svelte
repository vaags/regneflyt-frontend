<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { slide } from 'svelte/transition'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import RangeComponent from './widgets/RangeComponent.svelte'
    import { Operator } from '../models/enums/Operator'
    import type { Quiz } from '../models/Quiz'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import { getPuzzle } from '../services/puzzleService'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import { setUrlParams } from '../services/quizService'
    import PuzzlePreviewComponent from './widgets/PuzzlePreviewComponent.svelte'
    import PuzzleModeComponent from './widgets/PuzzleModeComponent.svelte'
    import type { AppSettings } from '../models/AppSettings'

    export let appSettings: AppSettings
    export let quiz: Quiz
    let puzzle = getPuzzle(quiz, undefined)
    const dispatch = createEventDispatcher()

    $: isDivision = quiz.selectedOperator === Operator.Division
    $: isMultiplication = quiz.selectedOperator === Operator.Multiplication
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
                {#if isMultiplication}
                    <h2
                        transition:slide|local="{appSettings.transitionDuration}">
                        Multiplikand
                    </h2>
                {:else if isDivision}
                    <h2
                        transition:slide|local="{appSettings.transitionDuration}">
                        Dividend
                        <small>(intervall)</small>
                    </h2>
                {:else}
                    <h2
                        transition:slide|local="{appSettings.transitionDuration}">
                        Første ledd
                        <small>(intervall)</small>
                    </h2>
                {/if}
                <div>
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
                            {#if isDivision}
                                <div
                                    class="mb-4"
                                    transition:slide|local="{appSettings.transitionDuration}">
                                    <AlertComponent
                                        message="Intervallverdi ganget med
                                        divisor" />
                                </div>
                            {/if}
                            <div>
                                <label for="partOneFrom">
                                    Fra og med:
                                    <RangeComponent
                                        id="partOneFrom"
                                        max="{quiz.partSettings[quiz.selectedOperator].partOne.maxValue - 1}"
                                        on:change="{() => updateQuizSettings()}"
                                        bind:value="{quiz.partSettings[quiz.selectedOperator].partOne.minValue}" />
                                </label>
                            </div>
                            <div class="mt-4">
                                <label for="partOneTo">
                                    Til og med:
                                    <RangeComponent
                                        id="partOneTo"
                                        min="{quiz.partSettings[quiz.selectedOperator].partOne.minValue + 1}"
                                        on:change="{() => updateQuizSettings()}"
                                        bind:value="{quiz.partSettings[quiz.selectedOperator].partOne.maxValue}" />
                                </label>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
            <div class="card mb-0">
                {#if isMultiplication}
                    <h2
                        transition:slide|local="{appSettings.transitionDuration}">
                        Multiplikator
                        <small>(intervall)</small>
                    </h2>
                {:else if isDivision}
                    <h2
                        transition:slide|local="{appSettings.transitionDuration}">
                        Divisor
                    </h2>
                {:else}
                    <h2
                        transition:slide|local="{appSettings.transitionDuration}">
                        Andre ledd
                        <small>(intervall)</small>
                    </h2>
                {/if}
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
                        transition:slide|local="{appSettings.transitionDuration}">
                        <div>
                            <label for="partTwoFrom">
                                Fra og med:
                                <br />
                                <RangeComponent
                                    id="partTwoFrom"
                                    max="{quiz.partSettings[quiz.selectedOperator].partTwo.maxValue - 1}"
                                    on:change="{() => updateQuizSettings()}"
                                    bind:value="{quiz.partSettings[quiz.selectedOperator].partTwo.minValue}" />
                            </label>
                        </div>
                        <div class="mt-4">
                            <label for="partTwoTo">
                                Til og med:
                                <br />
                                <RangeComponent
                                    id="partTwoTo"
                                    min="{quiz.partSettings[quiz.selectedOperator].partTwo.minValue + 1}"
                                    on:change="{() => updateQuizSettings()}"
                                    bind:value="{quiz.partSettings[quiz.selectedOperator].partTwo.maxValue}" />
                            </label>
                        </div>
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
        <label class="inline-flex items-center mt-4">
            <input
                type="checkbox"
                class="form-checkbox text-blue-700 h-5 w-5 border-gray-500"
                on:change="{() => updateQuizSettings(false)}"
                bind:checked="{quiz.showRemainingTime}" />
            <span class="ml-2">Vis gjenværende tid</span>
        </label>
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
    <ButtonComponent
        label="Start"
        on:click="{() => startQuiz()}"
        color="{validationError ? 'red' : 'green'}" />
</form>
