<script lang="ts">
    import * as animateScroll from 'svelte-scrollto'
    import { createEventDispatcher, onMount, tick } from 'svelte'
    import { slide } from 'svelte/transition'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import CardComponent from './widgets/CardComponent.svelte'
    import LabelComponent from './widgets/LabelComponent.svelte'
    import { Operator } from '../models/constants/Operator'
    import type { Quiz } from '../models/Quiz'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import { getPuzzle } from '../services/puzzleService'
    import { setUrlParams } from '../services/quizService'
    import { getOperatorScoreSettings } from '../services/scoreService'
    import PuzzlePreviewComponent from './widgets/PuzzlePreviewComponent.svelte'
    import type { AppSettings } from '../models/AppSettings'
    import type { OperatorSettings } from '../models/OperatorSettings'
    import { PuzzleMode } from '../models/constants/PuzzleMode'

    export let appSettings: AppSettings
    export let quiz: Quiz
    let puzzle = getPuzzle(quiz, appSettings.operatorSigns)
    const dispatch = createEventDispatcher()
    let showSharePanel: boolean

    // Sharing
    let textAreaDom: any
    let titleDom: any
    let shareLinkCopied: boolean
    let shareTitle: string

    let operatorSettings: OperatorSettings[]

    $: isMultiplication = quiz.selectedOperator === Operator.Multiplication
    $: isDivision = quiz.selectedOperator === Operator.Division
    $: isAllOperators = quiz.selectedOperator === 4
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

        dispatch('getReady', { quiz })
    }

    function getPuzzlePreview() {
        puzzle = getPuzzle(quiz, appSettings.operatorSigns, puzzle)
    }

    function updateQuizSettings(updatePuzzlePreview: boolean = true) {
        if (!appSettings.isProduction)
            operatorSettings = getOperatorScoreSettings(quiz)
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

    onMount(() => {
        if (quiz.showSettings) updateQuizSettings()
    })

    const minValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
    const maxValues = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99]
</script>

{#if appSettings.displayGreeting}
    <CardComponent>
        <p class="text-sm">
            Regneflyt er et mattespill som trener deg i hoderegning.
        </p>
        {#if quiz.showSettings}
            <p class="mt-2 text-sm">Velg hvordan du vil trene nedenfor.</p>
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
                    <span class="ml-2">{appSettings.operatorLabels[i]}</span>
                </label>
            {/each}
            <label class="flex items-center py-1">
                <input
                    type="radio"
                    class="h-5 w-5 text-blue-700"
                    bind:group="{quiz.selectedOperator}"
                    value="{4}" />
                <span class="ml-2">Alle</span>
            </label>
        </CardComponent>
        {#each Object.values(Operator) as operator}
            {#if operator === quiz.selectedOperator || isAllOperators}
                <div
                    transition:slide|local="{appSettings.transitionDuration}"
                    class="mb-3">
                    <CardComponent
                        heading="{operator === Operator.Multiplication ? 'Multiplikand' : operator === Operator.Division ? 'Divisor' : 'Intervall'}"
                        label="{appSettings.operatorLabels[operator]}">
                        {#if operator === Operator.Multiplication || operator === Operator.Division}
                            <div
                                transition:slide|local="{appSettings.transitionDuration}">
                                {#each Array(12) as _, i}
                                    <div>
                                        <label
                                            class="inline-flex items-center py-1">
                                            <input
                                                type="checkbox"
                                                class="h-5 w-5 rounded text-blue-700"
                                                bind:group="{quiz.operatorSettings[operator].possibleValues}"
                                                value="{i + 1}" />
                                            <span class="ml-2">{i + 1}</span>
                                        </label>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <div
                                transition:slide|local="{appSettings.transitionDuration}">
                                <div class="flex flex-row">
                                    <label class="mr-4" for="partOneMin">
                                        Fra og med
                                        <select
                                            class="block rounded"
                                            bind:value="{quiz.operatorSettings[operator].minValue}">
                                            {#each minValues as v}
                                                <option value="{v}">{v}</option>
                                            {/each}
                                        </select>
                                    </label>
                                    <label for="partOneMax">
                                        Til og med
                                        <select
                                            class="block rounded"
                                            bind:value="{quiz.operatorSettings[operator].maxValue}">
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
                                        <AlertComponent color="red">
                                            Intervallet er ugyldig.
                                        </AlertComponent>
                                    </div>
                                {/if}
                            </div>
                            {#if operator === Operator.Subtraction}
                                <label class="inline-flex items-center mt-4">
                                    <input
                                        type="checkbox"
                                        class="h-5 w-5 text-blue-700"
                                        bind:checked="{quiz.allowNegativeAnswer}" />
                                    <span class="ml-2">Tillat negative svar</span>
                                </label>
                            {/if}
                        {/if}
                    </CardComponent>
                </div>
            {/if}
        {/each}
        <CardComponent heading="Oppgaveform">
            {#each Object.values(PuzzleMode) as puzzleMode}
                <label class="flex items-center py-1">
                    <input
                        type="radio"
                        class="h-5 w-5 mr-2 text-blue-700"
                        bind:group="{quiz.puzzleMode}"
                        value="{puzzleMode}" />
                    <span>
                        {#if puzzleMode === PuzzleMode.Normal}
                            Normal
                            <span class="text-sm">(Svaret er ukjent)</span>
                        {:else if puzzleMode === PuzzleMode.Alternate}
                            Omvendt
                            <span class="text-sm">(Første eller andre ledd er
                                ukjent)</span>
                        {:else}Tilfeldig{/if}
                    </span>
                </label>
            {/each}
        </CardComponent>
    {/if}
    {#if !appSettings.isProduction && quiz.showSettings && !validationError}
        <CardComponent heading="Poeng">
            <ul>
                {#each operatorSettings as settings}
                    <li>
                        {appSettings.operatorLabels[settings.operator]}
                        :
                        {settings.score}
                    </li>
                {/each}
            </ul>
        </CardComponent>
    {/if}
    <CardComponent
        heading="{quiz.title || 'Forhåndsvisning'}"
        label="{quiz.title ? 'Forhåndsvisning' : undefined}">
        {#if validationError}
            <div transition:slide|local="{appSettings.transitionDuration}">
                <AlertComponent color="yellow">
                    Kan ikke vise forhåndsvisning.
                </AlertComponent>
            </div>
        {:else}
            <div
                class="text-2xl md:text-3xl text-center"
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
        {/if}
    </CardComponent>
    {#if quiz.showSettings}
        <CardComponent heading="Spilletid">
            <div class="flex flex-row">
                <label class="mr-4">
                    Totalt
                    <select class="block rounded" bind:value="{quiz.duration}">
                        <option value="{0.5}">30 sek</option>
                        <option value="{1}">1 min</option>
                        <option value="{3}">3 min</option>
                        <option value="{5}">5 min</option>
                        <option value="{10}">10 min</option>
                    </select>
                </label>
                <label>
                    Per oppgave
                    <select
                        class="block rounded"
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
                <label>Tittel
                    <input
                        type="text"
                        maxlength="50"
                        bind:this="{titleDom}"
                        on:keyup="{() => (shareLinkCopied = false)}"
                        class="rounded
                            w-3/4 block"
                        bind:value="{shareTitle}" />
                </label>
                <label class="block mt-4">
                    Lenke
                    <LabelComponent on:click="{copyShareLinkToClipboard}">
                        {shareLinkCopied ? 'Kopiert!' : 'Trykk for å kopiere'}
                    </LabelComponent>
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
