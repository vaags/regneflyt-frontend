<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'

    export let showCancelButton: boolean
    const dispatch = createEventDispatcher()

    let showWarning = false

    function toggleWarning() {
        showWarning = !showWarning
    }

    function abortQuiz() {
        dispatch('abortQuiz')
    }

    function completeQuiz() {
        dispatch('completeQuiz')
    }
</script>

<div class="text-right float-right">
    {#if showWarning}
        <p class="mb-2 text-gray-100 text-lg">Ønsker du å avbryte?</p>
        <ButtonComponent on:click="{abortQuiz}" color="red" margin="{true}">
            Ja
        </ButtonComponent>
        <ButtonComponent on:click="{toggleWarning}">Nei</ButtonComponent>
    {:else}
        {#if showCancelButton}
            <ButtonComponent on:click="{completeQuiz}" margin="{true}">
                Fullfør
            </ButtonComponent>
        {/if}
        <ButtonComponent on:click="{toggleWarning}" color="gray">
            Avbryt
        </ButtonComponent>
    {/if}
</div>
