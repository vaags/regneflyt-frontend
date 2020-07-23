<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import RangeComponent from './widgets/RangeComponent.svelte'
    import { Operator } from '../models/Operator'
    import { Quiz } from '../models/Quiz'
    import { AnswerMode } from '../models/AnswerMode'
    import AlertComponent from './widgets/AlertComponent.svelte'

    export let quiz: Quiz
    let timer: number

    const dispatch = createEventDispatcher()

    $: isDivision = quiz.selectedOperator === Operator.Division
    $: isMultiplication = quiz.selectedOperator === Operator.Multiplication

    $: validationError =
        (isMultiplication && quiz.partOne.possibleValues.length == 0) ||
        (isDivision && quiz.partTwo.possibleValues.length == 0)

    function startQuiz() {
        if (validationError) return

        if (isMultiplication) {
            quiz.partTwo.possibleValues = getArrayOfNumbers(
                quiz.partTwo.minValue,
                quiz.partTwo.maxValue
            )
            quiz.partOne.minValue = quiz.partOne.possibleValues[0]
            quiz.partOne.maxValue =
                quiz.partOne.possibleValues[
                    quiz.partOne.possibleValues.length - 1
                ]
        } else if (isDivision) {
            quiz.partOne.possibleValues = getArrayOfNumbers(
                quiz.partOne.minValue,
                quiz.partOne.maxValue
            )
            quiz.partTwo.minValue = quiz.partTwo.possibleValues[0]
            quiz.partTwo.maxValue =
                quiz.partTwo.possibleValues[
                    quiz.partTwo.possibleValues.length - 1
                ]
        } else {
            quiz.partOne.possibleValues = getArrayOfNumbers(
                quiz.partOne.minValue,
                quiz.partOne.maxValue
            )
            quiz.partTwo.possibleValues = getArrayOfNumbers(
                quiz.partTwo.minValue,
                quiz.partTwo.maxValue
            )
        }

        dispatch('startQuiz', { quiz })
    }

    function getArrayOfNumbers(first: number, last: number): Array<number> {
        return Array(last)
            .fill(first)
            .map((x, y) => x + y)
    }

    function setRequiredPartProperties() {
        if (isMultiplication || isDivision) {
            quiz.partOne.possibleValues = []
            quiz.partTwo.possibleValues = []
            quiz.partOne.randomize = isDivision
            quiz.partTwo.randomize = isMultiplication
            if (isMultiplication) {
                quiz.partTwo.minValue = 1
                quiz.partTwo.maxValue = 10
            } else {
                quiz.partOne.minValue = 1
                quiz.partOne.maxValue = 10
            }
        } else {
            quiz.partOne.randomize = true
            quiz.partTwo.randomize = true
        }
    }

    $: {
        clearTimeout(timer)
        timer = setTimeout(() => {
            // Set querystring params to allow for easy sharing of settings through url
            let parameters = {
                duration: quiz.duration.toString(),
                timeLimit: quiz.puzzleTimeLimit.toString(),
                operator: quiz.selectedOperator.toString(),
                negatives: quiz.allowNegativeAnswer.toString(),
                partOneMin: quiz.partOne.minValue.toString(),
                partOneMax: quiz.partOne.maxValue.toString(),
                partOneValues: isMultiplication
                    ? quiz.partOne.possibleValues.toString()
                    : null,
                partOneRandom: quiz.partOne.randomize.toString(),
                partTwoMin: quiz.partTwo.minValue.toString(),
                partTwoMax: quiz.partTwo.maxValue.toString(),
                partTwoValues: isDivision
                    ? quiz.partTwo.possibleValues.toString()
                    : null,
                partTwoRandom: quiz.partTwo.randomize.toString(),
                answerMode: quiz.answerMode.toString(),
            }

            window.history.replaceState(
                null,
                null,
                `?${new URLSearchParams(parameters)}`
            )
        }, 300)
    }
</script>

<form>
    <div class="card">
        <h2>Spilletid</h2>
        <label>
            Totalt:
            <span class="text-sm">(i minutter)</span>
            <br />
            <RangeComponent min="{1}" max="{30}" bind:value="{quiz.duration}" />
        </label>

        <label class="block mt-4">
            Per oppgave:
            <span class="text-sm">(i sekunder)</span>
            <br />
            <RangeComponent
                zeroLabel="Ingen"
                max="{10}"
                bind:value="{quiz.puzzleTimeLimit}" />
        </label>
    </div>
    <div class="card">
        <h2>Regnearter</h2>
        {#each quiz.operators as operator}
            <label class="flex items-center py-1">
                <input
                    type="radio"
                    class="form-radio h-5 w-5 text-blue-700 border-gray-500"
                    bind:group="{quiz.selectedOperator}"
                    value="{operator}"
                    on:change="{setRequiredPartProperties}" />
                <span class="ml-2">{operator}</span>
            </label>
        {/each}
        {#if quiz.selectedOperator === Operator.Subtraction || quiz.selectedOperator === Operator.All}
            <label class="inline-flex items-center mt-4">
                <input
                    type="checkbox"
                    class="form-checkbox text-blue-700 h-5 w-5 border-gray-500"
                    bind:checked="{quiz.allowNegativeAnswer}" />
                <span class="ml-2">Tillat negative svar</span>
            </label>
        {/if}
    </div>
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
                            bind:group="{quiz.partOne.possibleValues}"
                            value="{i + 1}" />
                        <span class="ml-2">{i + 1}</span>
                    </label>
                {/each}
            {:else}
                {#if isDivision}
                    <AlertComponent
                        message="Verdien vil utregnes fra intervallet ganget med
                        divisor." />
                {/if}
                <label>
                    Fra og med:
                    <br />
                    <RangeComponent
                        max="{quiz.partOne.maxValue}"
                        bind:value="{quiz.partOne.minValue}" />
                </label>
                <label class="block mt-4">
                    Til og med:
                    <br />
                    <RangeComponent
                        min="{quiz.partOne.minValue}"
                        bind:value="{quiz.partOne.maxValue}" />
                </label>
            {/if}
        </div>
        {#if isDivision}
            <label class="inline-flex items-center mt-6">
                <input
                    type="checkbox"
                    class="form-checkbox text-blue-700 h-5 w-5 border-gray-500"
                    bind:checked="{quiz.partOne.randomize}" />
                <span class="ml-2">Tilfeldige verdier</span>
            </label>
        {/if}
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
                            bind:group="{quiz.partTwo.possibleValues}"
                            value="{i + 1}" />
                        <span class="ml-2">{i + 1}</span>
                    </label>
                {/each}
            {:else}
                <label>
                    Fra og med:
                    <br />
                    <RangeComponent
                        max="{quiz.partTwo.maxValue}"
                        bind:value="{quiz.partTwo.minValue}" />
                </label>
                <label class="block mt-4">
                    Til og med:
                    <br />
                    <RangeComponent
                        min="{quiz.partTwo.minValue}"
                        bind:value="{quiz.partTwo.maxValue}" />
                </label>
            {/if}
        </div>
        {#if isMultiplication}
            <label class="inline-flex items-center mt-6">
                <input
                    type="checkbox"
                    class="form-checkbox text-blue-700 h-5 w-5 border-gray-500"
                    bind:checked="{quiz.partTwo.randomize}" />
                <span class="ml-2">Tilfeldige verdier</span>
            </label>
        {/if}
    </div>
    <div class="card">
        <h2>Ukjent ledd</h2>
        <label class="flex items-center py-1">
            <input
                type="radio"
                class="form-radio h-5 w-5 text-blue-700 border-gray-500"
                bind:group="{quiz.answerMode}"
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
                value="{AnswerMode.Random}" />
            <span class="ml-2">{AnswerMode.Random}</span>
        </label>
    </div>
    <ButtonComponent
        on:click="{startQuiz}"
        label="Start"
        color="{validationError ? 'red' : 'green'}" />
</form>
