<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import PuzzleComponent from './PuzzleComponent.svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import { Quiz } from '../models/Quiz'
    import { Operator } from '../models/Operator'

    export let quiz: Quiz

    const dispatch = createEventDispatcher()
    const interval = setTimeout(completeQuiz, quiz.duration * 60000)
    let showWarning = false
    let puzzleSet = []
    const isLocalhost = location.hostname === 'localhost'

    onDestroy(() => {
        clearInterval(interval)
    })

    onMount(() => {
        setOperator()
    })

    function abortQuiz() {
        dispatch('abortQuiz')
    }

    function completeQuiz() {
        dispatch('completeQuiz', { puzzleSet })
    }

    function addPuzzle(event) {
        puzzleSet = [...puzzleSet, event.detail.puzzle]
        setOperator()
    }

    function setOperator() {
        if (quiz.selectedOperator === Operator.All) {
            const random = Math.ceil(Math.random() * 4)

            quiz.activeOperator = quiz.operators[random - 1]
        } else {
            quiz.activeOperator = quiz.selectedOperator
        }
    }

    function toggleWarning() {
        showWarning = !showWarning
    }
</script>

<div>
    {#if quiz.activeOperator}
        <PuzzleComponent {quiz} on:addPuzzle="{addPuzzle}" />
    {/if}

    <div class="text-right float-right">
        {#if showWarning}
            <p class="mb-2 text-gray-100">Er du sikker på at du vil avbryte?</p>
            <ButtonComponent on:click="{abortQuiz}" label="ja" color="red" />
            <ButtonComponent on:click="{toggleWarning}" label="Nei" />
        {:else}
            {#if isLocalhost}
                <ButtonComponent on:click="{completeQuiz}" label="Fullfør" />
            {/if}
            <ButtonComponent
                on:click="{toggleWarning}"
                label="Avbryt"
                color="gray" />
        {/if}
    </div>
</div>
