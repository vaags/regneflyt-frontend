<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import CardComponent from './widgets/CardComponent.svelte'
    import TimeoutComponent from './widgets/TimeoutComponent.svelte'

    const dispatch = createEventDispatcher()
</script>

<CardComponent heading="Tiden er ute&hellip;">
    <p class="text-center font-light my-16 text-5xl md:text-6xl animate-bounce">
        ⌛
        <TimeoutComponent
            hidden="{true}"
            seconds="{3}"
            fadeOnSecondChange="{true}"
            on:finished="{() => dispatch('evaluateQuiz')}" />
    </p>
</CardComponent>
