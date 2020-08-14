<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import TimeoutComponent from './widgets/TimeoutComponent.svelte'
    import type { AppSettings } from '../models/AppSettings'

    export let appSettings: AppSettings

    const dispatch = createEventDispatcher()

    function evaluateQuiz() {
        dispatch('evaluateQuiz')
    }
</script>

<div class="card">
    <h2>Tiden er ute&hellip;</h2>

    <p class="text-center font-light my-16 text-4xl md:text-5xl animate-ping">
        ⌛
        <TimeoutComponent
            hidden="{true}"
            seconds="{appSettings.countDownTime}"
            fadeOnSecondChange="{true}"
            on:finished="{evaluateQuiz}" />
    </p>
</div>
