<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import TimeoutComponent from './widgets/TimeoutComponent.svelte'
    import type { AppSettings } from '../models/AppSettings'

    export let appSettings: AppSettings

    const dispatch = createEventDispatcher()

    function startQuiz() {
        dispatch('startQuiz')
    }
</script>

<div class="card">
    <h2>Gjør deg klar&hellip;</h2>

    <p class="text-center my-12 text-4xl md:text-5xl">
        <TimeoutComponent
            seconds="{appSettings.countDownTime}"
            fadeOnSecondChange="{true}"
            on:finished="{startQuiz}" />
    </p>
</div>
