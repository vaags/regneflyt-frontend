<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import TimeoutComponent from './widgets/TimeoutComponent.svelte'

    export let apiRequestComplete: boolean
    const dispatch = createEventDispatcher()

    let timeoutReached: boolean = false

    $: if (timeoutReached && apiRequestComplete) {
        dispatch('evaluateQuiz')
    }
</script>

<div class="card">
    <h2>Tiden er ute&hellip;</h2>

    <p class="text-center font-light my-16 text-5xl md:text-6xl animate-bounce">
        ⌛
        <TimeoutComponent
            hidden="{true}"
            seconds="{3}"
            fadeOnSecondChange="{true}"
            on:finished="{() => (timeoutReached = true)}" />
    </p>
</div>
