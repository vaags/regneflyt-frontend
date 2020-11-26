<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import CardComponent from './widgets/CardComponent.svelte'
    import TimeoutComponent from './widgets/TimeoutComponent.svelte'
    import type { AppSettings } from '../models/AppSettings'
    import type { Puzzle } from '../models/Puzzle'
    import CancelComponent from './CancelComponent.svelte'

    export let appSettings: AppSettings
    let puzzleSet: Puzzle[] = []
    let showComponent: boolean

    const dispatch = createEventDispatcher()

    function startQuiz() {
        dispatch('startQuiz')
    }

    function completeQuiz() {
        dispatch('completeQuiz', { puzzleSet })
    }

    function abortQuiz() {
        dispatch('abortQuiz')
    }

    onMount(() => {
        setTimeout(() => {
            showComponent = true
        }, appSettings.pageTransitionDuration.duration)
    })
</script>

{#if showComponent}
    <div transition:fade="{appSettings.pageTransitionDuration}">
        <CardComponent heading="Gjør deg klar&hellip;">
            <p class="text-center my-10 text-6xl md:text-7xl">
                <TimeoutComponent
                    seconds="{3}"
                    countToZero="{false}"
                    fadeOnSecondChange="{true}"
                    on:finished="{startQuiz}" />
            </p>
        </CardComponent>

        <CancelComponent
            showCancelButton="{!appSettings.isProduction}"
            on:abortQuiz="{abortQuiz}"
            on:completeQuiz="{completeQuiz}" />
    </div>
{/if}
