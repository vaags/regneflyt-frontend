<script lang="ts">
    import type { Highscore } from '../models/Highscore'
    import CardComponent from './widgets/CardComponent.svelte'
    import { slide } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte'
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

<CardComponent heading="Topp 10">
    {#if highScores}
        <div transition:slide|local="{appSettings.transitionDuration}">
            <HighscoreTableComponent highScores="{highScores}" />
        </div>
    {:else}
        <div transition:slide|local="{appSettings.transitionDuration}">
            <AlertComponent>Laster topp 10 ...</AlertComponent>
        </div>
    {/if}
</CardComponent>

<ButtonComponent color="green" on:click="{toggleShowHighscores}">
    Tilbake
</ButtonComponent>
