<script lang="ts">
    import * as animateScroll from 'svelte-scrollto'
    import { createEventDispatcher, onMount, tick } from 'svelte'
    import { slide, fade } from 'svelte/transition'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import CardComponent from './widgets/CardComponent.svelte'
    import LabelComponent from './widgets/LabelComponent.svelte'
    import { Operator } from '../models/constants/Operator'
    import type { Quiz } from '../models/Quiz'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import { getPuzzle } from '../services/puzzleService'
    import { setUrlParams } from '../services/quizService'
    import PuzzlePreviewComponent from './widgets/PuzzlePreviewComponent.svelte'
    import type { AppSettings } from '../models/AppSettings'
    import { PuzzleMode } from '../models/constants/PuzzleMode'

    export let appSettings: AppSettings
    export let quiz: Quiz

    let showComponent: boolean = true
    let puzzle = getPuzzle(quiz, appSettings.operatorSigns)
    const dispatch = createEventDispatcher()
    let showSharePanel: boolean

    // Sharing
    let textAreaDom: any
    let titleDom: any
    let shareLinkCopied: boolean
    let shareTitle: string

    // let operatorSettings: OperatorSettings[]

    $: isMultiplication = quiz.selectedOperator === Operator.Multiplication
    $: isDivision = quiz.selectedOperator === Operator.Division
    $: isAllOperators = quiz.selectedOperator === 4
    $: hasInvalidAdditionRange =
        quiz.operatorSettings[Operator.Addition].maxValue <
        quiz.operatorSettings[Operator.Addition].minValue
    $: hasInvalidSubtractionRange =
        quiz.operatorSettings[Operator.Subtraction].maxValue <
        quiz.operatorSettings[Operator.Subtraction].minValue
    $: hasInvalidRange = hasInvalidAdditionRange || hasInvalidSubtractionRange

    $: missingPossibleValues =
        (isMultiplication || isDivision || isAllOperators) &&
        (quiz.operatorSettings[Operator.Multiplication].possibleValues
            ?.length == 0 ||
            quiz.operatorSettings[Operator.Division].possibleValues?.length ==
                0)

    $: validationError = missingPossibleValues || hasInvalidRange

    $: !validationError && quiz && updateQuizSettings()

    function getPuzzlePreview() {
        puzzle = getPuzzle(quiz, appSettings.operatorSigns, puzzle)
    }

    function updateQuizSettings(updatePuzzlePreview: boolean = true) {
        // if (!appSettings.isProduction)
        //     operatorSettings = getOperatorScoreSettings(quiz)
        if (updatePuzzlePreview) getPuzzlePreview()
        if (quiz.showSettings) setUrlParams(quiz)
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

    async function toggleSharePanel() {
        showSharePanel = !showSharePanel
        if (showSharePanel) {
            await tick()
            titleDom.focus()
            animateScroll.scrollToBottom()
        }
    }

    function getReady() {
        dispatch('getReady', { quiz: { ...quiz, previousScore: undefined } })
    }

    onMount(() => {
        if (appSettings.menuFade) {
            showComponent = false
            setTimeout(() => {
                showComponent = true
            }, appSettings.pageTransitionDuration.duration)
        } else {
            showComponent = true
        }
        if (quiz.showSettings) updateQuizSettings()
    })

    const minValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
    const maxValues = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99]
</script>

{#if showComponent}
    <div transition:fade="{appSettings.pageTransitionDuration}">
        {#if appSettings.displayGreeting}
            <CardComponent isInfo="{true}">
                <p>Regneflyt er et mattespill som trener deg i hoderegning.</p>
                {#if quiz.showSettings}
                    <p class="mt-2">Velg hvordan du vil trene nedenfor.</p>
                {/if}
            </CardComponent>
        {/if}
        <form>
          {#if quiz.showSettings}
                <CardComponent heading="Regneart">
                    {#each Object.values(Operator) as operator, i}
                        <label class="flex items-center py-1">
                            <input
                                type="radio"
                                class="h-5 w-5 text-blue-700"
                                bind:group="{quiz.selectedOperator}"
                                value="{operator}" />
                            <span
                                class="ml-2 text-lg">{appSettings.operatorLabels[i]}</span>
                        </label>
                    {/each}
                    <label class="flex items-center py-1">
                        <input
                            type="radio"
                            class="h-5 w-5 text-lg text-blue-700"
                            bind:group="{quiz.selectedOperator}"
                            value="{4}" />
                        <span class="ml-2 text-lg">Alle</span>
                    </label>
                </CardComponent>
                {#each Object.values(Operator) as operator}
                    {#if operator === quiz.selectedOperator || isAllOperators}
                        <div
                            transition:slide|local="{appSettings.transitionDuration}"
                            class="mb-1 md:mb-2">
                            <CardComponent
                                heading="{operator === Operator.Multiplication ? 'Multiplikand' : operator === Operator.Division ? 'Divisor' : 'Intervall'}"
                                label="{isAllOperators ? appSettings.operatorLabels[operator] : undefined}">
                                {#if operator === Operator.Multiplication || operator === Operator.Division}
                                    {#each Array(12) as _, i}
                                        <div>
                                            <label
                                                class="inline-flex items-center py-1">
                                                <input
                                                    type="checkbox"
                                                    class="h-5 w-5 rounded text-blue-700"
                                                    bind:group="{quiz.operatorSettings[operator].possibleValues}"
                                                    value="{i + 1}" />
                                                <span
                                                    class="ml-2 text-lg">{i + 1}</span>
                                            </label>
                                        </div>
                                    {/each}
                                {:else}
                                    <div
                                        class="flex flex-row place-items-center mb-1">
                                        <label
                                            class="mr-3 text-lg"
                                            for="partOneMin">Fra</label>
                                        <select
                                            class="rounded text-lg"
                                            id="partOneMin"
                                            bind:value="{quiz.operatorSettings[operator].minValue}">
                                            {#each minValues as v}
                                                <option value="{v}">{v}</option>
                                            {/each}
                                        </select>
                                        <label
                                            for="partOneMax"
                                            class="mx-3 text-lg">
                                            til
                                        </label>
                                        <select
                                            class="rounded text-lg"
                                            id="partOneMax"
                                            bind:value="{quiz.operatorSettings[operator].maxValue}">
                                            {#each maxValues as v}
                                                <option value="{v}">{v}</option>
                                            {/each}
                                        </select>
                                    </div>
                                    {#if (operator === Operator.Addition && hasInvalidAdditionRange) || (operator === Operator.Subtraction && hasInvalidSubtractionRange)}
                                        <div
                                            transition:slide|local="{appSettings.transitionDuration}"
                                            class="mt-4">
                                            <AlertComponent color="red">
                                                Intervallet er ugyldig.
                                            </AlertComponent>
                                        </div>
                                    {/if}
                                    {#if operator === Operator.Subtraction}
                                        <label
                                            class="inline-flex items-center mt-4 text-lg">
                                            <input
                                                type="checkbox"
                                                class="h-5 w-5 text-blue-700 rounded"
                                                bind:checked="{quiz.allowNegativeAnswer}" />
                                            <span class="ml-2">Tillat negative
                                                svar</span>
                                        </label>
                                    {/if}
                                {/if}
                            </CardComponent>
                        </div>
                    {/if}
                {/each}
                <CardComponent heading="Oppgaveform">
                    <div class="flex flex-row justify-between items-center">
                        <div>
                            {#each Object.values(PuzzleMode) as puzzleMode}
                                <label class="flex items-center py-1 text-lg">
                                    <input
                                        type="radio"
                                        class="h-5 w-5 mr-2 text-blue-700"
                                        bind:group="{quiz.puzzleMode}"
                                        value="{puzzleMode}" />
                                    <span>
                                        {#if puzzleMode === PuzzleMode.Normal}
                                            Normal
                                        {:else if puzzleMode === PuzzleMode.Alternate}
                                            Omvendt
                                        {:else}Tilfeldig{/if}
                                    </span>
                                </label>
                            {/each}
                        </div>
                        <div>
                            {#if validationError}
                                <div
                                    transition:slide|local="{appSettings.transitionDuration}">
                                    <AlertComponent color="yellow">
                                        Kan ikke vise forhåndsvisning.
                                    </AlertComponent>
                                </div>
                            {:else}
                                <div
                                    class="text-xl md:text-2xl bg-blue-100 py-2 px-4 border border-gray-500 rounded"
                                    transition:slide|local="{appSettings.transitionDuration}">
                                    <PuzzlePreviewComponent puzzle="{puzzle}" />
                                    <button
                                        type="button"
                                        class="cursor-pointer focus:outline-none ml-3"
                                        title="Nytt oppgave-eksempel"
                                        on:click="{() => getPuzzlePreview()}">
                                        🎲
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </div>
                </CardComponent>
            {/if}
            {#if !quiz.showSettings}
                <CardComponent heading="{quiz.title}" label="Forhåndsvisning">
                    <div
                        class="text-3xl md:text-4xl text-center mb-1 mt-4"
                        transition:slide|local="{appSettings.transitionDuration}">
                        <PuzzlePreviewComponent puzzle="{puzzle}" />
                        <button
                            type="button"
                            class="cursor-pointer focus:outline-none ml-3 float-right"
                            title="Nytt oppgave-eksempel"
                            on:click="{() => getPuzzlePreview()}">
                            🎲
                        </button>
                    </div>
                </CardComponent>
            {:else}
                <CardComponent heading="Spilletid">
                    <div class="flex flex-row mb-1">
                        <label class="mr-4 text-lg">
                            Totalt
                            <select
                                class="block rounded text-lg"
                                bind:value="{quiz.duration}">
                                <option value="{0.5}">30 sek</option>
                                <option value="{1}">1 min</option>
                                <option value="{3}">3 min</option>
                                <option value="{5}">5 min</option>
                                <option value="{10}">10 min</option>
                            </select>
                        </label>
                        <label class="text-lg">
                            Per oppgave
                            <select
                                class="block rounded text-lg"
                                bind:value="{quiz.puzzleTimeLimit}">
                                <option value="{2}">2 sek</option>
                                <option value="{3}">3 sek</option>
                                <option value="{5}">5 sek</option>
                                <option value="{10}">10 sek</option>
                                <option value="{0}">Ubegrenset</option>
                            </select>
                        </label>
                    </div>
                </CardComponent>
            {/if}
            {#if showSharePanel}
                <div transition:slide|local="{appSettings.transitionDuration}">
                    <CardComponent heading="Deling">
                        <label class="text-lg">Tittel
                            <input
                                type="text"
                                maxlength="50"
                                bind:this="{titleDom}"
                                on:keyup="{() => (shareLinkCopied = false)}"
                                class="rounded w-3/4 block text-lg"
                                bind:value="{shareTitle}" />
                        </label>
                        <label class="block mt-4">
                            <span class="text-lg">Lenke</span>
                            <span class="float-right">
                                <LabelComponent
                                    on:click="{copyShareLinkToClipboard}">
                                    {shareLinkCopied ? 'Kopiert!' : 'Trykk for å kopiere'}
                                </LabelComponent>
                            </span>
                            <textarea
                                class="rounded w-full font-mono text-xs"
                                rows="4"
                                bind:this="{textAreaDom}"
                                value="{window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search}&title={encodeURIComponent(shareTitle)}&showSettings=false"></textarea>
                        </label>
                    </CardComponent>
                </div>
            {/if}
            <ButtonComponent
                on:click="{() => getReady()}"
                disabled="{validationError}"
                color="{validationError ? 'red' : 'green'}">
                Start
            </ButtonComponent>
            <div class="float-right">
                {#if quiz.showSettings}
                    <ButtonComponent
                        on:click="{toggleSharePanel}"
                        disabled="{validationError}"
                        color="{validationError ? 'red' : showSharePanel ? 'gray' : 'blue'}">
                        Del
                    </ButtonComponent>
                {:else}
                    <ButtonComponent
                        color="gray"
                        on:click="{() => (quiz.showSettings = true)}">
                        Meny
                    </ButtonComponent>
                {/if}
            </div>
        </form>
    </div>
{/if}
