<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { slide } from 'svelte/transition'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import LabelComponent from './widgets/LabelComponent.svelte'
    import { Operator } from '../models/enums/Operator'
    import type { Quiz } from '../models/Quiz'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import { getPuzzle } from '../services/puzzleService'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import { setUrlParams } from '../services/quizService'
    import { getQuizScore } from '../services/scoreService'
    import PuzzlePreviewComponent from './widgets/PuzzlePreviewComponent.svelte'
    import PuzzleModeComponent from './widgets/PuzzleModeComponent.svelte'
    import type { AppSettings } from '../models/AppSettings'
    import type { OperatorSettings } from '../models/OperatorSettings'

    export let appSettings: AppSettings
    export let quiz: Quiz
    let puzzle = getPuzzle(quiz, undefined)
    const dispatch = createEventDispatcher()
    let showSharePanel: boolean

    // Sharing
    let textAreaDom: any
    let shareLinkCopied: boolean

    let operatorSettings: OperatorSettings[]

    $: isMultiplication = quiz.selectedOperator === Operator.Multiplication
    $: isDivision = quiz.selectedOperator === Operator.Division
    $: isAllOperators = quiz.selectedOperator === Operator.All
    $: hasInvalidRange =
        quiz.operatorSettings[Operator.Addition].maxValue <
            quiz.operatorSettings[Operator.Addition].minValue ||
        quiz.operatorSettings[Operator.Subtraction].maxValue <
            quiz.operatorSettings[Operator.Subtraction].minValue

    $: missingPossibleValues =
        (isMultiplication || isDivision || isAllOperators) &&
        (quiz.operatorSettings[Operator.Multiplication].possibleValues
            ?.length == 0 ||
            quiz.operatorSettings[Operator.Division].possibleValues?.length ==
                0)

    $: validationError = missingPossibleValues || hasInvalidRange

    $: !validationError && quiz && updateQuizSettings()

    function getReady() {
        if (validationError) return

        dispatch('getReady', {
            quiz: { ...quiz, operatorSettings: operatorSettings },
        })
    }

    function getPuzzlePreview() {
        puzzle = getPuzzle(quiz, puzzle)
    }

    function updateQuizSettings(updatePuzzlePreview: boolean = true) {
        operatorSettings = getQuizScore(quiz.operatorSettings)
        if (updatePuzzlePreview) getPuzzlePreview()
        setUrlParams(quiz)
    }

    function copyShareLinkToClipboard() {
        textAreaDom.focus()
        textAreaDom.select()

        const successful = document.execCommand('copy')
        if (!successful) {
            console.error('unable to copy share link')
        } else {
            shareLinkCopied = true
        }
    }

    onMount(() => {
        if (quiz.showSettings) updateQuizSettings()
    })

    const minValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
    const maxValues = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99]
</script>

{#if appSettings.displayGreeting}
    <div
        class="card text-sm"
        transition:slide|local="{appSettings.transitionDuration}">
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
    {#if quiz.showSettings}
        <div class="card">
            <h2>Regneart</h2>
            {#each appSettings.operators as operator}
                <label class="flex items-center py-1">
                    <input
                        type="radio"
                        class="form-radio h-5 w-5 text-blue-700 border-gray-500"
                        bind:group="{quiz.selectedOperator}"
                        value="{operator}" />
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
                        message="De valgte innstillingene for alle fire
                        regnearter vil bli brukt." />
                </div>
            {:else if quiz.selectedOperator === Operator.Subtraction}
                <div transition:slide|local="{appSettings.transitionDuration}">
                    <label class="inline-flex items-center mt-4">
                        <input
                            type="checkbox"
                            class="form-checkbox text-blue-700 h-5 w-5
                            border-gray-500"
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
                        {:else if isDivision}Divisor{:else}Intervall{/if}
                    </h2>
                    {#if !validationError}
                        <p class="mb-4">
                            Score: {operatorSettings[quiz.selectedOperator].score}
                        </p>
                    {/if}
                    {#if isMultiplication || isDivision}
                        <div
                            transition:slide|local="{appSettings.transitionDuration}">
                            {#each Array(12) as _, i}
                                <div>
                                    <label
                                        class="inline-flex items-center py-1">
                                        <input
                                            type="checkbox"
                                            class="form-checkbox text-blue-700
                                            h-5 w-5 border-gray-500"
                                            bind:group="{quiz.operatorSettings[quiz.selectedOperator].possibleValues}"
                                            value="{i + 1}" />
                                        <span class="ml-2">{i + 1}</span>
                                    </label>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div
                            transition:slide|local="{appSettings.transitionDuration}">
                            <!-- svelte-ignore a11y-no-onchange -->
                            <div class="flex flex-row">
                                <label class="mr-4" for="partOneMin">
                                    Fra og med
                                    <select
                                        class="form-select block"
                                        bind:value="{quiz.operatorSettings[quiz.selectedOperator].minValue}">
                                        {#each minValues as v}
                                            <option value="{v}">{v}</option>
                                        {/each}
                                    </select>
                                </label>
                                <label for="partOneMax">
                                    Til og med
                                    <select
                                        class="form-select block"
                                        bind:value="{quiz.operatorSettings[quiz.selectedOperator].maxValue}">
                                        {#each maxValues as v}
                                            <option value="{v}">{v}</option>
                                        {/each}
                                    </select>
                                </label>
                            </div>
                            {#if hasInvalidRange}
                                <div
                                    transition:slide|local="{appSettings.transitionDuration}"
                                    class="mt-4">
                                    <AlertComponent
                                        color="red"
                                        message="Intervallet er ugyldig." />
                                </div>
                            {/if}
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
            </div>
        {/if}
        <div class="card">
            <h2>Oppgaveform</h2>
            {#each appSettings.puzzleModes as puzzleMode}
                <label class="flex items-center py-1">
                    <input
                        type="radio"
                        class="form-radio h-5 w-5 text-blue-700 border-gray-500
                        mr-2"
                        bind:group="{quiz.puzzleMode}"
                        value="{puzzleMode}" />
                    <PuzzleModeComponent {puzzleMode} />
                </label>
            {/each}
        </div>
    {/if}
    <div class="card">
        {#if quiz.title}
            <LabelComponent>Forhåndsvisning</LabelComponent>
        {/if}
        <h2>{quiz.title || 'Forhåndsvisning'}</h2>

        {#if validationError}
            <div transition:slide|local="{appSettings.transitionDuration}">
                <AlertComponent
                    color="yellow"
                    message="Kan ikke vise forhåndsvisning." />
            </div>
        {:else}
            <div
                class="text-2xl md:text-3xl text-center"
                transition:slide|local="{appSettings.transitionDuration}">
                <PuzzlePreviewComponent {puzzle} />
                <button
                    type="button"
                    class="cursor-pointer focus:outline-none ml-3 float-right"
                    title="Nytt oppgave-eksempel"
                    on:click="{() => getPuzzlePreview()}">
                    🎲
                </button>
            </div>
        {/if}
    </div>
    {#if quiz.showSettings}
        <div class="card">
            <h2>Spilletid</h2>
            <div class="flex flex-row">
                <label class="mr-4">
                    Totalt
                    <select
                        class="form-select block"
                        bind:value="{quiz.duration}">
                        <option value="{0.5}">30 sek</option>
                        <option value="{1}">1 min</option>
                        <option value="{3}">3 min</option>
                        <option value="{5}">5 min</option>
                        <option value="{10}">10 min</option>
                        <option value="{15}">15 min</option>
                        <option value="{25}">25 min</option>
                    </select>
                </label>
                <label>
                    Per oppgave
                    <select
                        class="form-select block"
                        bind:value="{quiz.puzzleTimeLimit}">
                        <option value="{2}">2 sek</option>
                        <option value="{3}">3 sek</option>
                        <option value="{5}">5 sek</option>
                        <option value="{10}">10 sek</option>
                        <option value="{0}">&#8734;</option>
                    </select>
                </label>
            </div>
        </div>
    {/if}
    {#if showSharePanel}
        <div
            class="card"
            transition:slide|local="{appSettings.transitionDuration}">
            <h2>Deling</h2>
            <label class="sr-only" for="shareTitle">Lenke</label>
            <input
                id="shareTitle"
                type="text"
                maxlength="50"
                on:keyup="{() => (shareLinkCopied = false)}"
                placeholder="Tittel"
                class="form-input w-3/4"
                bind:value="{quiz.sharing.title}" />
            <label class="inline-flex items-center mt-4">
                <input
                    type="checkbox"
                    on:change="{() => (shareLinkCopied = false)}"
                    class="form-checkbox text-blue-700 h-5 w-5 border-gray-500"
                    bind:checked="{quiz.sharing.showSettings}" />
                <span class="ml-2">Vis innstillinger</span>
            </label>
            <label class="block mt-4">
                Lenke
                <LabelComponent on:click="{copyShareLinkToClipboard}">
                    {shareLinkCopied ? 'Kopiert!' : 'Trykk for å kopiere'}
                </LabelComponent>
                <textarea
                    class="form-textarea w-full font-mono text-xs"
                    rows="4"
                    bind:this="{textAreaDom}"
                    value="{window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search}&title={encodeURIComponent(quiz.sharing.title)}&showSettings={quiz.sharing.showSettings}"></textarea>
            </label>
        </div>
    {/if}
    <ButtonComponent
        label="Start"
        on:click="{() => getReady()}"
        disabled="{validationError}"
        color="{validationError ? 'red' : 'green'}" />
    {#if quiz.showSettings}
        <div class="float-right">
            <ButtonComponent
                label="Del"
                on:click="{() => (showSharePanel = !showSharePanel)}"
                disabled="{validationError}"
                color="{validationError ? 'red' : showSharePanel ? 'purple' : 'blue'}" />
        </div>
    {:else}
        <div class="float-right">
            <ButtonComponent
                label="Vis innstillinger"
                small="{true}"
                on:click="{() => (quiz.showSettings = true)}" />
        </div>
    {/if}
</form>
