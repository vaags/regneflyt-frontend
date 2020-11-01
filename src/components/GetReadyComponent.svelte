<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import CardComponent from './widgets/CardComponent.svelte'
    import TimeoutComponent from './widgets/TimeoutComponent.svelte'
    import type { AppSettings } from '../models/AppSettings'
    import type { Puzzle } from '../models/Puzzle'
    import CancelComponent from './CancelComponent.svelte'

    export let appSettings: AppSettings
    let puzzleSet: Puzzle[] = []

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
</script>

<CardComponent heading="Gjør deg klar&hellip;">
    <p class="text-center my-12 text-5xl md:text-6xl">
        <TimeoutComponent
            seconds="{3}"
            fadeOnSecondChange="{true}"
            on:finished="{startQuiz}" />
    </p>
</CardComponent>

<CancelComponent
    showCancelButton="{!appSettings.isProduction}"
    on:abortQuiz="{abortQuiz}"
    on:completeQuiz="{completeQuiz}" />
