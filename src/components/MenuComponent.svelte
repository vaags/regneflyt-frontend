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
    import type { Puzzle } from '../models/Puzzle'
    import type { NumberRange } from '../models/NumberRange'

    export let appSettings: AppSettings
    export let quiz: Quiz

    let showComponent: boolean = true
    let puzzle: Puzzle | undefined
    const dispatch = createEventDispatcher()
    let showSharePanel: boolean

    // Sharing
    let textAreaDom: any
    let titleDom: any
    let shareLinkCopied: boolean
    let shareTitle: string

    $: isMultiplication = quiz.selectedOperator === Operator.Multiplication
    $: isDivision = quiz.selectedOperator === Operator.Division
    $: isAllOperators = quiz.selectedOperator === 4
    $: hasInvalidAdditionRange = !rangeIsValid(
        quiz.operatorSettings[Operator.Addition].range
    )
    $: hasInvalidSubtractionRange = !rangeIsValid(
        quiz.operatorSettings[Operator.Subtraction].range
    )
    $: hasInvalidRange = hasInvalidAdditionRange || hasInvalidSubtractionRange

    $: missingPossibleValues =
        (isMultiplication || isDivision || isAllOperators) &&
        (quiz.operatorSettings[Operator.Multiplication].possibleValues
            ?.length == 0 ||
            quiz.operatorSettings[Operator.Division].possibleValues?.length ==
                0)

    $: validationError =
        missingPossibleValues ||
        hasInvalidRange ||
        quiz.selectedOperator === undefined

    $: if (!validationError && quiz) {
        updateQuizSettings()
    }

    function rangeIsValid(range: NumberRange) {
        return range.min < range.max
    }

    function getPuzzlePreview() {
        puzzle = getPuzzle(quiz, appSettings.operatorSigns, puzzle)
    }

    function updateQuizSettings() {
        getPuzzlePreview()
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
        if (quiz.showSettings && !validationError) updateQuizSettings()
    })

    const minValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
    const maxValues = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99]
    const durationValues = [0.5, 1, 3, 5]
</script>

{#if showComponent}
    <div transition:fade="{appSettings.pageTransitionDuration}">
        {#if quiz.selectedOperator === undefined}
            <div
                transition:slide|local="{appSettings.transitionDuration}"
                class="mb-1 md:mb-2">
                <CardComponent>
                    <div class="text-blue-800 text-lg">
                        <p>
                            Regneflyt er et mattespill som trener deg i
                            hoderegning.
                        </p>
                        <p class="mt-2">Velg hvordan du vil trene nedenfor.</p>
                    </div>
                </CardComponent>
            </div>
        {/if}
        <form>
            {#if quiz.showSettings}
                <div transition:slide|local="{appSettings.transitionDuration}">
                    <CardComponent heading="Velg regneart">
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
                </div>
                {#if quiz.selectedOperator !== undefined}
                    <div
                        transition:slide|local="{appSettings.transitionDuration}">
                        {#each Object.values(Operator) as operator}
                            {#if operator === quiz.selectedOperator || isAllOperators}
                                <div
                                    transition:slide|local="{appSettings.transitionDuration}"
                                    class="mb-1 md:mb-2">
                                    <CardComponent
                                        heading="{operator === Operator.Multiplication ? 'Multiplikand' : operator === Operator.Division ? 'Divisor' : 'Tallområde'}"
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
                                                    for="partOneMin-{operator}">Fra</label>
                                                <select
                                                    class="rounded text-lg"
                                                    id="partOneMin-{operator}"
                                                    bind:value="{quiz.operatorSettings[operator].range.min}">
                                                    {#each minValues as v}
                                                        <option value="{v}">
                                                            {v}
                                                        </option>
                                                    {/each}
                                                </select>
                                                <label
                                                    for="partOneMax-{operator}"
                                                    class="mx-3 text-lg">
                                                    til
                                                </label>
                                                <select
                                                    class="rounded text-lg"
                                                    id="partOneMax-{operator}"
                                                    bind:value="{quiz.operatorSettings[operator].range.max}">
                                                    {#each maxValues as v}
                                                        <option value="{v}">
                                                            {v}
                                                        </option>
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
                                                    <span class="ml-2">Tillat
                                                        negative svar</span>
                                                </label>
                                            {/if}
                                        {/if}
                                    </CardComponent>
                                </div>
                            {/if}
                        {/each}
                        <div>
                            <CardComponent heading="Oppgaveform">
                                <div
                                    class="flex flex-row justify-between items-center">
                                    <div>
                                        {#each Object.values(PuzzleMode) as puzzleMode}
                                            <label
                                                class="flex items-center py-1 text-lg">
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
                                                    Kan ikke vise
                                                    forhåndsvisning.
                                                </AlertComponent>
                                            </div>
                                        {:else}
                                            <div
                                                class="relative text-xl md:text-2xl pt-7 pb-1 md:pb-2 px-2 md:px-4 border border-blue-800 rounded-tl rounded-br"
                                                transition:slide|local="{appSettings.transitionDuration}">
                                                <div
                                                    class="absolute w-full right-0 top-0 text-xs text-white py-1 px-2 bg-blue-800 text-right">
                                                    Forhåndsvisning
                                                </div>
                                                <PuzzlePreviewComponent
                                                    puzzle="{puzzle}" />
                                                <button
                                                    type="button"
                                                    class="cursor-pointer focus:outline-none ml-1 md:ml-3"
                                                    title="Nytt oppgave-eksempel"
                                                    on:click="{() => getPuzzlePreview()}">
                                                    🎲
                                                </button>
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            </CardComponent>
                            <CardComponent heading="Spilletid">
                                {#each Object.values(durationValues) as d}
                                    <label class="flex items-center py-1">
                                        <input
                                            type="radio"
                                            class="h-5 w-5 text-blue-700"
                                            bind:group="{quiz.duration}"
                                            value="{d}" />
                                        <span
                                            class="ml-2 text-lg">{d === 0.5 ? '30 sekunder' : d === 1 ? d + ' minutt' : d + ' minutter'}</span>
                                    </label>
                                {/each}
                                <label class="flex mt-3 items-center py-1">
                                    <input
                                        type="checkbox"
                                        class="h-5 w-5 rounded text-blue-700"
                                        bind:checked="{quiz.puzzleTimeLimit}" />
                                    <span class="ml-2 text-lg">Tidsbegrensning
                                        per oppgave</span>
                                </label>
                            </CardComponent>
                        </div>
                    </div>
                {/if}
            {:else}
                <div transition:slide|local="{appSettings.transitionDuration}">
                    <CardComponent
                        heading="{quiz.title}"
                        label="Forhåndsvisning">
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
                </div>
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
                color="green">
                Start
            </ButtonComponent>
            <div class="float-right">
                {#if quiz.showSettings}
                    <ButtonComponent
                        on:click="{toggleSharePanel}"
                        disabled="{validationError}"
                        color="{showSharePanel ? 'gray' : 'blue'}">
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
