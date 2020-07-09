<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Operator from './widgets/Operator.svelte';
    import Alert from './widgets/Alert.svelte';

    const dispatch = createEventDispatcher();

    export let puzzleSet;

    function resetQuiz() {
        dispatch('resetQuiz');
    }

</script>

<div>
    <Alert message="Good job! Here are your results." />

    <table class="table-auto mb-4 mx-auto mt-4">
        <thead>
            <tr class="text-gray-800">
                <th class="px-4 py-2">Puzzle</th>
                <th class="px-4 py-2">Answer</th>
                <th class="px-4 py-2">Evaluation</th>
                <th class="px-4 py-2">Time</th>
            </tr>
        </thead>
        <tbody>
            {#each puzzleSet as puzzle}
                <tr>
                    <td class="border-t px-4 py-2">{puzzle.partOne} <Operator operator={puzzle.operator} /> {puzzle.partTwo} = ?</td>
                    <td class="border-t px-4 py-2">{puzzle.answer}</td>
                    <td class="border-t px-4 py-2">
                        {#if puzzle.isCorrect}
                            <span class="text-green-500">Correct</span>
                        {:else}
                            <span class="text-red-500">Incorrect</span>
                        {/if}
                    </td>
                    <td class="border-t px-4 py-2">{Math.round(puzzle.duration * 10) / 10} s</td>
                </tr>
            {/each}
            <tr>
                <td class="border-t-2 px-4 py-2" colspan="3"></td>
                <td class="border-t-2 px-4 py-2 font-bold">-</td>
            </tr>
        </tbody>
    </table>


    <Button on:click={resetQuiz} label="To menu" />


</div>
