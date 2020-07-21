<script>
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import Puzzle from './Puzzle.svelte'
    import Button from './widgets/Button.svelte'

    export let quiz

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
        if (quiz.selectedOperator === 'alle') {
            const random = Math.ceil(Math.random() * 4)

            quiz.activeOperator = quiz.operators[random - 1].toLowerCase()
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
        <Puzzle {quiz} on:addPuzzle="{addPuzzle}" />
    {/if}

    <div class="text-right float-right">
        {#if showWarning}
            <p class="mb-2 text-gray-100">Er du sikker på at du vil avbryte?</p>
            <Button on:click="{abortQuiz}" label="ja" color="red" />
            <Button on:click="{toggleWarning}" label="Nei" />
        {:else}
            {#if isLocalhost}
                <Button on:click="{completeQuiz}" label="Fullfør" />
            {/if}
            <Button on:click="{toggleWarning}" label="Avbryt" color="gray" />
        {/if}
    </div>
</div>
