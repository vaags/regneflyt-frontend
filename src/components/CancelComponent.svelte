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
        <p class="mb-2 text-gray-100">Ønsker du å avbryte?</p>
        <span class="mr-1">
            <ButtonComponent on:click="{abortQuiz}" color="red">
                Ja
            </ButtonComponent>
        </span>
        <ButtonComponent on:click="{toggleWarning}">Nei</ButtonComponent>
    {:else}
        {#if showCancelButton}
            <span class="mr-1">
                <ButtonComponent on:click="{completeQuiz}">
                    Fullfør
                </ButtonComponent>
            </span>
        {/if}
        <ButtonComponent on:click="{toggleWarning}" color="gray">
            Avbryt
        </ButtonComponent>
    {/if}
</div>
