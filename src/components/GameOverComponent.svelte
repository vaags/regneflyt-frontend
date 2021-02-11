<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import PanelComponent from './widgets/PanelComponent.svelte'
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
        <PanelComponent heading="Tiden er ute&hellip;">
            <p
                class="text-center font-light my-16 text-6xl md:text-7xl animate-bounce"
            >
                ⌛
                <TimeoutComponent
                    hidden="{true}"
                    seconds="{appSettings.separatorPageDuration}"
                    fadeOnSecondChange="{true}"
                    on:finished="{() => dispatch('evaluateQuiz')}"
                />
            </p>
        </PanelComponent>
    </div>
{/if}
