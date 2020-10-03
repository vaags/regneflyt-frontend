<script lang="ts">
    import type { Highscore } from '../models/Highscore'
    import { slide } from 'svelte/transition'
    import { createEventDispatcher, onMount } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import HighscoreTableComponent from './widgets/HighscoreTableComponent.svelte'
    import type { AppSettings } from '../models/AppSettings'
    import AlertComponent from './widgets/AlertComponent.svelte'

    const dispatch = createEventDispatcher()

    function toggleShowHighscores() {
        dispatch('toggleShowHighscores')
    }

    export let highScores: Highscore[]
    export let appSettings: AppSettings
</script>

<div class="card">
    <h2>Topp 10</h2>
    {#if highScores}
        <div transition:slide|local="{appSettings.transitionDuration}">
            <HighscoreTableComponent highScores="{highScores}" />
        </div>
    {:else}
        <div transition:slide|local="{appSettings.transitionDuration}">
            <AlertComponent message="Laster topp 10" />
        </div>
    {/if}
</div>

<ButtonComponent on:click="{toggleShowHighscores}" color="gray">
    Meny
</ButtonComponent>
