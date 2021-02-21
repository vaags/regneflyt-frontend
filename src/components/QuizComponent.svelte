<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import PuzzleComponent from './PuzzleComponent.svelte'
    import type { Quiz } from '../models/Quiz'
    import type { Puzzle } from '../models/Puzzle'
    import type { AppSettings } from '../models/AppSettings'
    import CancelComponent from './CancelComponent.svelte'
    import { QuizState } from '../models/constants/QuizState'
    import PanelComponent from './widgets/PanelComponent.svelte'
    import TimeoutComponent from './widgets/TimeoutComponent.svelte'

    export let quiz: Quiz
    export let appSettings: AppSettings

    const dispatch = createEventDispatcher()
    let showComponent: boolean
    let puzzleSet: Puzzle[] = []

    function startQuiz() {
        dispatch('startQuiz')
    }

    function abortQuiz() {
        dispatch('abortQuiz')
    }

    function completeQuiz() {
        dispatch('completeQuiz', { puzzleSet })
    }

    function addPuzzle(event: any) {
        puzzleSet = [...puzzleSet, event.detail.puzzle]
    }

    onMount(() => {
        setTimeout(() => {
            showComponent = true
        }, appSettings.pageTransitionDuration.duration)
    })
</script>

{#if showComponent}
    <div transition:fade="{appSettings.pageTransitionDuration}">
        {#if quiz.state === QuizState.AboutToStart}
            <PanelComponent heading="Gjør deg klar&hellip;">
                <p class="text-center my-10 text-6xl md:text-7xl">
                    <TimeoutComponent
                        seconds="{appSettings.separatorPageDuration}"
                        countToZero="{false}"
                        fadeOnSecondChange="{true}"
                        on:finished="{startQuiz}"
                    />
                </p>
            </PanelComponent>
        {:else}
            <PuzzleComponent
                seconds="{quiz.duration * 60}"
                quiz="{quiz}"
                appSettings="{appSettings}"
                on:quizTimeout="{completeQuiz}"
                on:addPuzzle="{addPuzzle}"
            />
        {/if}

        <CancelComponent
            showCancelButton="{!appSettings.isProduction}"
            on:abortQuiz="{abortQuiz}"
            on:completeQuiz="{completeQuiz}"
        />
    </div>
{/if}
