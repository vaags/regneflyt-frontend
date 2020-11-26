<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import CardComponent from './widgets/CardComponent.svelte'
    import TimeoutComponent from './widgets/TimeoutComponent.svelte'
    import type { AppSettings } from '../models/AppSettings'

    export let appSettings: AppSettings

    const dispatch = createEventDispatcher()

    let showComponent: boolean

    onMount(() => {
        setTimeout(() => {
            showComponent = true
        }, appSettings.pageTransitionDuration.duration)
    })
</script>

{#if showComponent}
    <div transition:fade="{appSettings.pageTransitionDuration}">
        <CardComponent heading="Tiden er ute&hellip;">
            <p
                class="text-center font-light my-16 text-6xl md:text-7xl animate-bounce">
                ⌛
                <TimeoutComponent
                    hidden="{true}"
                    seconds="{3}"
                    fadeOnSecondChange="{true}"
                    on:finished="{() => dispatch('evaluateQuiz')}" />
            </p>
        </CardComponent>
    </div>
{/if}
