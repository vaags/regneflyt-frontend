<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'

    export let isLocalhost: boolean
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
            <ButtonComponent on:click="{abortQuiz}" label="ja" color="red" />
        </span>
        <ButtonComponent on:click="{toggleWarning}" label="Nei" />
    {:else}
        {#if isLocalhost}
            <span class="mr-1">
                <ButtonComponent on:click="{completeQuiz}" label="Fullfør" />
            </span>
        {/if}
        <ButtonComponent
            on:click="{toggleWarning}"
            color="gray"
            label="Avbryt" />
    {/if}
</div>
