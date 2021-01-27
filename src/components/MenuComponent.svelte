<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { slide, fade } from 'svelte/transition'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import { Operator } from '../models/constants/Operator'
    import type { Quiz } from '../models/Quiz'
    import { getPuzzle } from '../services/puzzleService'
    import { setUrlParams, getOperatorSettings } from '../services/quizService'
    import type { AppSettings } from '../models/AppSettings'
    import type { Puzzle } from '../models/Puzzle'
    import type { NumberRange } from '../models/NumberRange'
    import WelcomePanel from './panels/WelcomePanel.svelte'
    import OperatorSelectionPanel from './panels/OperatorSelectionPanel.svelte'
    import OperatorSettingsPanel from './panels/OperatorSettingsPanel.svelte'
    import PuzzleTypePanel from './panels/PuzzleTypePanel.svelte'
    import QuizDurationPanel from './panels/QuizDurationPanel.svelte'
    import QuizPreviewPanel from './panels/QuizPreviewPanel.svelte'
    import SharePanel from './panels/SharePanel.svelte'
    import DifficultyPanel from './panels/DifficultyPanel.svelte'
    import { PuzzleMode } from '../models/constants/PuzzleMode'

    export let appSettings: AppSettings
    export let quiz: Quiz

    let showComponent: boolean = true
    let puzzle: Puzzle | undefined
    const dispatch = createEventDispatcher()
    let showSharePanel: boolean
    const customDifficultyId = 'x'

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
        quiz.selectedOperator === undefined ||
        (!quiz.difficulty && quiz.showSettings) // For backwards-compatibility: Show start button for shared quiz, even with no difficulty-setting

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

    function getReady() {
        dispatch('getReady', { quiz })
    }

    function setDifficultyLevel(event: any) {
        quiz.difficulty = event.detail.level
        quiz.title = ''

        if (
            quiz.selectedOperator === undefined ||
            quiz.difficulty === customDifficultyId
        )
            return

        quiz.puzzleMode =
            quiz.difficulty > 3 ? PuzzleMode.Random : PuzzleMode.Normal

        quiz.duration = quiz.difficulty > 2 ? 1 : 0.5

        if (quiz.selectedOperator === 4) {
            Object.values(Operator).forEach((operator) => {
                quiz.operatorSettings[operator] = getOperatorSettings(
                    quiz.difficulty,
                    quiz.selectedOperator
                )
            })
        } else {
            quiz.operatorSettings[quiz.selectedOperator] = getOperatorSettings(
                quiz.difficulty,
                quiz.selectedOperator
            )
        }
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
</script>

{#if showComponent}
    <div transition:fade="{appSettings.pageTransitionDuration}">
        {#if quiz.selectedOperator === undefined}
            <WelcomePanel
                transitionDuration="{appSettings.transitionDuration}"
            />
        {/if}
        <form>
            {#if quiz.showSettings}
                <OperatorSelectionPanel
                    appSettings="{appSettings}"
                    bind:selectedOperator="{quiz.selectedOperator}"
                />
                {#if quiz.selectedOperator !== undefined}
                    <DifficultyPanel
                        transitionDuration="{appSettings.transitionDuration}"
                        level="{quiz.difficulty}"
                        on:setDifficultyLevel="{setDifficultyLevel}"
                    />
                {/if}
                {#if quiz.selectedOperator !== undefined && quiz.difficulty === customDifficultyId}
                    <div
                        transition:slide|local="{appSettings.transitionDuration}"
                    >
                        {#each Object.values(Operator) as operator}
                            {#if operator === quiz.selectedOperator || isAllOperators}
                                <OperatorSettingsPanel
                                    appSettings="{appSettings}"
                                    operator="{operator}"
                                    isAllOperators="{isAllOperators}"
                                    hasInvalidAdditionRange="{hasInvalidAdditionRange}"
                                    hasInvalidSubtractionRange="{hasInvalidSubtractionRange}"
                                    bind:possibleValues="{quiz.operatorSettings[
                                        operator
                                    ].possibleValues}"
                                    bind:rangeMin="{quiz.operatorSettings[
                                        operator
                                    ].range.min}"
                                    bind:rangeMax="{quiz.operatorSettings[
                                        operator
                                    ].range.max}"
                                    bind:allowNegativeAnswer="{quiz.allowNegativeAnswer}"
                                />
                            {/if}
                        {/each}
                        <PuzzleTypePanel
                            bind:quizPuzzleMode="{quiz.puzzleMode}"
                        />
                        <QuizDurationPanel
                            bind:duration="{quiz.duration}"
                            bind:puzzleTimeLimit="{quiz.puzzleTimeLimit}"
                        />
                    </div>
                {/if}
            {/if}
            {#if quiz.selectedOperator !== undefined && (quiz.difficulty || !quiz.showSettings)}
                <QuizPreviewPanel
                    puzzle="{puzzle}"
                    title="{quiz.title}"
                    transitionDuration="{appSettings.transitionDuration}"
                    validationError="{validationError}"
                    on:getPuzzlePreview="{() => getPuzzlePreview()}"
                />
            {/if}

            {#if showSharePanel}
                <SharePanel
                    transitionDuration="{appSettings.transitionDuration}"
                />
            {/if}
            <ButtonComponent
                on:click="{() => getReady()}"
                disabled="{validationError}"
                color="green"
            >
                Start
            </ButtonComponent>
            <div class="float-right">
                {#if quiz.showSettings}
                    <ButtonComponent
                        on:click="{() => (showSharePanel = !showSharePanel)}"
                        disabled="{validationError}"
                        color="{showSharePanel ? 'gray' : 'blue'}"
                    >
                        Del
                    </ButtonComponent>
                {:else}
                    <ButtonComponent
                        color="gray"
                        on:click="{() => (quiz.showSettings = true)}"
                    >
                        Meny
                    </ButtonComponent>
                {/if}
            </div>
        </form>
    </div>
{/if}
