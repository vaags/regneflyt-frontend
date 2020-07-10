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

<div class="mb-4 border rounded px-4 pt-2 pb-3">
    <h2 class="mb-3 text-xl font-thin">Resultater</h2>
    {#if !puzzleSet || !puzzleSet.length}
        <Alert color="yellow" message="Ingen fullførte oppgaver ble funnet." />
    {:else}

        <table class="table-auto my-4">
            <thead>
                <tr class="text-gray-800">
                    <th class="pr-4 py-2">Oppgave</th>
                    <th class="px-4 py-2">Svar</th>
                    <th class="px-4 py-2">Vurdering</th>
                    <th class="px-4 py-2">Tidsbruk</th>
                </tr>
            </thead>
            <tbody>
                {#each puzzleSet as puzzle}
                    <tr>
                        <td class="border-t pr-4 py-2">{puzzle.partOne} <Operator operator={puzzle.operator} /> {puzzle.partTwo} = ?</td>
                        <td class="border-t px-4 py-2">{puzzle.answer}</td>
                        <td class="border-t px-4 py-2">
                            {#if puzzle.isCorrect}
                                <span class="text-green-500">Riktig</span>
                            {:else}
                                <span class="text-red-500">Galt</span>
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
    {/if}
</div>

<Button on:click={resetQuiz} label="Til hovedmenyen" />
